$core_v2_page.AddLink('stylesheet', $core_v2_widget.GetExecutedFileUrl('style.less'), "%{ Position = 'AfterTheme' }")
#set($user = $core_v2_user.Accessing)
#set($bearerToken = $telligent_v1_usms.GetBearerToken())
#set($swimmerId = $user.ProfileFields.SwimmerID.Value)
#if(!$user || $bearerToken == '')
    $core_v2_widget.Hide()
#end

<script type="text/html" id="recordTemplate">
    <% foreach (results, function(r) { %>
        <h3 class="record__item-title"><%: r.title %></h3>
        <% foreach (r.entries, function(e) { %>
            <div class="row record__item card">
                <div class="col-sm-3">
                    <%: e.title %>
                </div>
                <div class="col-sm-3">
                    <%: getRecordTimeString(e.date) %>
                </div>
                <div class="col-sm-2 record__item-time">
                    <%: getSwimTimeString(e.time) %>
                </div>
            </div>
        <% }); %>
    <% }); %>
</script>

<script type="text/html" id="swimTemplate">
    <% foreach (swims, function(swim) { %>
        <div class="row swim-feed__item card">
            <div class="col-6">
                <div class="swim-feed__item-title"><%: swim.swimTitle %></div>
                <div class="swim-feed__item-location"><%: swim.poolLocation %></div>
                <div class="swim-feed__item-date"><%: (new Date(swim.swimDateTime)).toLocaleString() %></div>
            </div>
            <div class="col-6 swim-feed__item-metrics">
                <div class="row">
                    <div class="col-4">
                        <label>Distance</label>
                        <p><%: formatNumber(swim.swimDistance) %><span><%: swim.swimUnit %></span></p>
                    </div>
                    <div class="col-4">
                        <label>Pace/100<%: swim.courseUnit %></label>
                        <p><%: getSwimTimeString(swim.swimPace) %></p>
                    </div>
                    <div class="col-4">
                        <label>Time</label>
                        <p><%: getSwimTimeString(swim.swimDuration) %></p>
                    </div>
                </div>
            </div>
        </div>
    <% }); %>
</script>

<div class="swim-feed__container">
    <ul class="swim-feed__nav" role="tablist">
        <li class="swim-feed__nav-item swim-feed__nav-item--active">
            <a href="#" onclick="getSwimFeed(event)">Recent Swims</a>
        </li>
        <li class="swim-feed__nav-item">
            <a href="#" type="button" onclick="getPersonalRecords(event)">Personal Records</a>
        </li>
    </ul>
    <div class="swim-feed__content">
        
    </div>
</div>

#registerEndOfPageHtml()
    ## end of page HTML
    <script type="text/javascript" charset="utf-8">
    const recordTemplate = jQuery.telligent.evolution.template.compile('recordTemplate');
    const swimTemplate = jQuery.telligent.evolution.template.compile('swimTemplate');
    
    function getPersonalRecords(e) {
        const buttons = document.querySelectorAll('.swim-feed__nav-item');
        for (let i = 0; i < buttons.length; i += 1) {
            buttons[i].classList.remove('swim-feed__nav-item--active');
        }
        e.target.parentNode.classList.add('swim-feed__nav-item--active');
        const bearerToken = '$bearerToken';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '$usms_v1_configuration.GetSwimComApiUrl()' + 'api/v1/achievements/personalrecord');
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', `Bearer ${bearerToken}`);
		xhr.setRequestHeader('Accept', `application/json`);
        xhr.onload = function() {
            if (xhr.status === 200) {
                renderRecords(xhr.response.data);
            } else {
                console.error('Error getting swimfeed');
            }
        }
        xhr.onerror = function() {
            console.log('Error geting swimfeed');
            renderSwims(testSwims);
        }
        xhr.send();
    }
    
    function renderRecords(records) {
        if (!records) return;
        const container = document.querySelector('.swim-feed__content');
        container.innerHTML = '';
        let result = [];
        for (let i = 0; i < records.achievements.courseTypes.length; i += 1) {
            let record = records.achievements.courseTypes[i];
            result.push({
                title: record.length + record.unit + ' Records',
                entries: [
                      { title: 'Fastest 50', ...record.personalRecords.fastest_50 },
                      { title: 'Fastest 100', ...record.personalRecords.fastest_100 },
                      { title: 'Fastest 200', ...record.personalRecords.fastest_200 },
                      { title: 'Fastest 400', ...record.personalRecords.fastest_400 },
                      { title: 'Fastest 800', ...record.personalRecords.fastest_800 },
                      { title: 'Fastest Swim', ...record.personalRecords.fastest_swim },
                      { title: 'Longest Swim', ...record.personalRecords.longest_swim }
                ]
            })
        }
        const renderedRecords = recordTemplate({ results: result });
        container.insertAdjacentHTML("beforeend", renderedRecords);
    }
    
    function getRecordTimeString(value) {
        if (!value) return;
        const date = new Date(value);
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleString('en-US', options);
    }
    
    function getSwimFeed(e) {
        if (e) e.preventDefault();
        const bearerToken = '$bearerToken';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '$usms_v1_configuration.GetSwimComApiUrl()' + 'api/v1/swimmer/swims?page=1&per_page=10&sort=descend');
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', `Bearer ${bearerToken}`);
		xhr.setRequestHeader('Accept', `application/json`);
        xhr.onload = function() {
            if (xhr.status === 200) {
                renderSwims(xhr.response.data);
            } else {
                console.error('Error getting swimfeed');
            }
        }
        xhr.onerror = function() {
            console.log('Error geting swimfeed');
            renderSwims(testSwims);
        }
        xhr.send();
    }
    
    function renderSwims(swims) {
        if (!swims) return;
        const container = document.querySelector('.swim-feed__content');
        container.innerHTML = '';
        let result = [];
        for (let i = 0; i < swims.length; i += 1) {
            result.push({
                swimTitle: swims[i].swimTitle,
                swimDateTime: swims[i].swimDateTime,
                poolLocation: swims[i].pool ? swims[i].pool.poolLocation.address : '',
                swimUnit: swims[i].swimUnit === 'm' ? 'METERS' : 'YARDS',
                swimDistance: swims[i].swimDistance,
                courseUnit: swims[i].courseUnit,
                swimPace: swims[i].swimPace,
                swimDuration: swims[i].swimDuration,
            });
        }
        const renderedSwims = swimTemplate({ swims: result });
        container.insertAdjacentHTML("beforeend", renderedSwims);
    }
    
    function getSwimTimeString(seconds) {
        const newDate = new Date(seconds * 1000);
        return newDate.toISOString().substr(14, 8)
    }
    
    function formatNumber(number) {
        return new Intl.NumberFormat().format(number)
    }
    
    (function() {
        const token = '$bearerToken';
        if (token) {
            getSwimFeed();
        }
    })();
</script>
#end