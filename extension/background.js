// Wishtale-Erweiterung (Dev 116, Option B): Ein Klick auf das Symbol öffnet ein kleines Wishtale-Fenster
// mit dem Wunschdialog für die aktuelle Seite. Die Erweiterung liest nur Adresse und Titel des aktiven Tabs,
// und nur in dem Moment, in dem jemand auf das Symbol klickt (activeTab). Sonst passiert nichts.
const APP = 'https://wishtale.de/app/';

const cleanTitle = t => String(t || '').split(/ [|–—-] /)[0].trim().slice(0, 120);

chrome.action.onClicked.addListener(async tab => {
  const url = tab && tab.url;
  if (!url || !/^https?:/i.test(url)) {
    await chrome.windows.create({ url: APP, type: 'popup', width: 520, height: 780 });
    return;
  }
  if (url.startsWith(APP) || /^https:\/\/wishtale\.de\//.test(url)) return;
  const q = new URLSearchParams({ share_url: url, share_title: cleanTitle(tab.title) });
  await chrome.windows.create({ url: `${APP}?${q}`, type: 'popup', width: 520, height: 780 });
});
