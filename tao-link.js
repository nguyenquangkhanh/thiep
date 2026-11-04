const form = document.querySelector('#link-form');
const base = document.querySelector('#base-url');
const guestName = document.querySelector('#guest-name');
const output = document.querySelector('#guest-link');
const result = document.querySelector('#link-result');
const status = document.querySelector('#link-status');

if (/^https?:$/.test(location.protocol)) base.value = new URL('./', location.href).href;
form.addEventListener('submit', event => {
  event.preventDefault();
  result.hidden = true;
  const url = new URL(base.value);
  const name = guestName.value.replace(/\s+/gu, ' ').trim();
  if (!/^https?:$/.test(url.protocol) || !name) {
    status.textContent = 'Hãy nhập tên khách và đường dẫn thiệp bắt đầu bằng https://.';
    return;
  }
  url.hash = '';
  url.searchParams.set('name', name);
  output.value = url.href;
  document.querySelector('#preview-link').href = url.href;
  result.hidden = false;
  status.textContent = '';
});
document.querySelector('#copy-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    status.textContent = 'Đã sao chép link.';
  } catch {
    output.select();
    status.textContent = 'Hãy sao chép đường dẫn đã được chọn.';
  }
});
