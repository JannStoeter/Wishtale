/* Wartezustand für KI-Empfehlungen: freundlich, mit ruhiger Bewegung und Platzhalterkarten. */
export const AiLoading = text => `<div class="aiload" role="status" aria-live="polite"><div class="aiload-h"><span class="aiload-dots" aria-hidden="true"><i></i><i></i><i></i></span><b>${text}</b></div>
 <p class="muted" style="font-size:14px;margin:4px 0 12px">Das dauert etwa zehn Sekunden, dafür passen die Ideen zu dem, was wir wissen.</p>
 <div class="aiload-cards" aria-hidden="true"><div></div><div></div><div></div></div></div>`;
