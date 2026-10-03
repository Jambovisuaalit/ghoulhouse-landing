/** Browser behavior checks using the existing CI CDP session. */
export async function checkOverlayMenu({ client, evaluate, assert, sleep, screenshotDir, writeFile, label }) {
  await evaluate(client, `document.querySelector('.ghMenuTrigger').click()`);
  await sleep(500);
  const state = await evaluate(client, `(() => {
    const dialog = document.querySelector('.ghOverlayMenu');
    const close = dialog.querySelector('.ghMenuClose');
    return {
      modal: dialog.open && dialog.matches(':modal'),
      focused: document.activeElement === close,
      locked: document.body.style.position === 'fixed',
      unclipped: dialog.scrollWidth <= dialog.clientWidth + 1,
      links: [...dialog.querySelectorAll('.ghOverlayNav a')].map(a => a.getAttribute('href')),
      cta: dialog.querySelector('.ghOverlayCta').getAttribute('href'),
      expanded: document.querySelector('.ghMenuTrigger').getAttribute('aria-expanded'),
    };
  })()`);
  assert(state.modal && state.focused && state.locked && state.unclipped && state.expanded === 'true',
    `${label}: overlay state incorrect: ${JSON.stringify(state)}`);
  assert(JSON.stringify(state.links) === JSON.stringify(['/#palvelut', '/#toiminta', '/referenssit', '/some-sisallontuotanto/hinta', '/resurssit', '/#yhteys']),
    `${label}: overlay destinations changed.`);
  assert(state.cta === '/?intent=photos#yhteys', `${label}: overlay CTA lost photo intent.`);
  await evaluate(client, `document.querySelector('.ghOverlayBottom a').focus()`);
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert(await evaluate(client, `document.activeElement === document.querySelector('.ghOverlayBrand')`), `${label}: Tab escaped modal.`);
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 });
  assert(await evaluate(client, `document.activeElement === document.querySelector('.ghOverlayBottom a')`), `${label}: Shift+Tab escaped modal.`);
  await evaluate(client, `document.querySelector('.ghOverlayMenu').scrollTop = 0`);
  const image = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(`${screenshotDir}/overlay-${label}.png`, Buffer.from(image.data, 'base64'));
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(300);
  assert(await evaluate(client, `!document.querySelector('.ghOverlayMenu').open && document.body.style.position !== 'fixed' && document.activeElement === document.querySelector('.ghMenuTrigger')`),
    `${label}: Escape did not restore background/focus.`);
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate(client, `document.querySelector('.ghMenuTrigger').click()`);
  assert(await evaluate(client, `getComputedStyle(document.querySelector('.ghOverlayMenu')).animationName === 'none'`), `${label}: reduced motion ignored.`);
  await evaluate(client, `document.querySelector('.ghMenuClose').click()`);
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
}
