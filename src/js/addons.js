const strokeSelect = document.getElementById('strokeSelect');
const videoAddBtn = document.querySelector('.product-option_video-stroke-analysis-eligible .add-on');

strokeSelect.addEventListener('change', () => {
  videoAddBtn.disabled = strokeSelect.value === '0';
});

document.querySelectorAll('.product-option .add-on').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.product-option').classList.toggle('selected');
  });
});
