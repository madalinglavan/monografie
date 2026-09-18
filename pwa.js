(() => {
  "use strict";
  const button = document.getElementById("installAppButton");
  const dialog = document.getElementById("installAppDialog");
  if (!button || !dialog) return;
  let installPrompt = null;
  const standalone = window.matchMedia("(display-mode: standalone)");
  const installed = () => {
    button.hidden = true;
    if (dialog.open) dialog.close();
  };
  if (standalone.matches || navigator.standalone) installed();
  standalone.addEventListener("change", event => { if (event.matches) installed(); });
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    if (!standalone.matches && !navigator.standalone) button.hidden = false;
  });
  window.addEventListener("appinstalled", () => { installPrompt = null; installed(); });
  button.addEventListener("click", async () => {
    if (installPrompt) {
      const prompt = installPrompt;
      installPrompt = null;
      try {
        await prompt.prompt();
        const result = await prompt.userChoice;
        if (result.outcome === "accepted") installed();
        return;
      } catch (error) { console.warn("Instalarea nu a putut fi inițiată:", error); }
    }
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    document.getElementById("installAppInstructions").textContent = !window.isSecureContext
      ? "Instalarea este disponibilă pe versiunea publică a site-ului, printr-o conexiune HTTPS."
      : ios
        ? "Deschide monografia în Safari, apasă Partajează, apoi Adaugă pe ecranul principal. Dacă apare opțiunea Deschide ca aplicație web, păstreaz-o activată și apasă Adaugă."
        : "Din meniul browserului, caută Instalează aplicația sau Adaugă pe ecranul principal. Dacă opțiunea nu apare încă, reîncarcă pagina și încearcă din Chrome sau Edge. Disponibilitatea instalării depinde de browser.";
    dialog.showModal();
  });
  dialog.querySelector(".app-install-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(error => console.warn("Modul offline nu este disponibil:", error));
    });
  }
})();
