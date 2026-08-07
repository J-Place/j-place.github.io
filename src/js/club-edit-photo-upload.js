/**
 * Club Edit — Photo Upload Validation
 *
 * club-edit.js's setSectionInputStatus() enables/disables #file-1 (club logo)
 * and #file-2 (club background) along with every other field in the section,
 * but nothing was ever wired to their change event — so choosing a file did
 * nothing: no extension/size validation, no thumbnail preview.
 *
 * Mirrors production's Details.js UploadFile(): validates extension and
 * max file size (data-file-size, in bytes), then previews the chosen image
 * via FileReader. Skips the AJAX POST to /apis/v1/clubweb/image/upload/photo
 * production sends afterward — this mockup has no backend to receive it,
 * same as every other section's save handler here.
 */
(function () {
  var VALID_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png'];
  var INVALID_TYPE_MESSAGE = 'Invalid image type. Please upload a GIF, JPG, JPEG, or PNG file.';

  function sizeErrorMessage(maxSizeBytes) {
    return 'File size exceeds the ' + (maxSizeBytes / 1000000).toFixed(1) + 'mb limit.';
  }

  function validatePhotoUpload(e) {
    var input = e.target;
    var files = input.files;
    if (!files || files.length === 0) return;

    var file = files[0];
    var ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    var maxSize = Number(input.dataset.fileSize);
    var validExt = VALID_EXTENSIONS.indexOf(ext) !== -1;
    var validSize = file.size <= maxSize;
    var isValid = validExt && validSize;

    // Type is checked first — an oversized file with a bad extension shows
    // the type message, since that's the more fundamental problem.
    var helpBlock = input.parentNode.parentNode.querySelector('span.help-block');
    if (helpBlock && !isValid) {
      helpBlock.textContent = !validExt ? INVALID_TYPE_MESSAGE : sizeErrorMessage(maxSize);
    }

    setInputStatus(input, isValid);
    if (!isValid) return;

    var reader = new FileReader();
    reader.onload = function (ev) {
      var thumbnail = input.parentNode.parentNode.querySelector('.upload-thumbnail');
      if (thumbnail) thumbnail.style.backgroundImage = 'url("' + ev.target.result + '")';
    };
    reader.readAsDataURL(file);
  }

  document.addEventListener('DOMContentLoaded', function () {
    ['#file-1', '#file-2'].forEach(function (selector) {
      var input = document.querySelector(selector);
      if (input) input.addEventListener('change', validatePhotoUpload);
    });
  });
})();
