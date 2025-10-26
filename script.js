document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-btn");
  const confirmBtn = document.getElementById("confirm-btn");
  const landingView = document.getElementById("landing-view");
  const paymentView = document.getElementById("payment-view");
  const scratchView = document.getElementById("scratch-view");

  const langButtons = document.querySelectorAll(".lang-btn");
  let currentLang = "en";

  const translations = {
    en: {
      title: "Scratch and win online lotto",
      prizeRange: "Try your luck and win 50,000–100,000",
      investment: "Your investment only €10.00",
      accept: "Accept",
      decline: "Decline",
      paymentTitle: "RubbelGlück",
      paymentAmount: "Amount: €10.00",
      paymentInfo: "To complete your payment, please transfer €10 to the following account:",
      paymentNote: "Once payment is made, you’ll instantly receive your online scratch ticket.",
      yourTicket: "Your Lottery Ticket",
      yourNumber: "Your Number:",
      scratchInstruction: "Scratch to reveal your number",
      scratched: "scratched",
      scratchCanvasText: "SCRATCH HERE"
    },
    de: {
      title: "Online-Lotto: Kratze und gewinne",
      prizeRange: "Versuche dein Glück und gewinne 50.000–100.000",
      investment: "Deine Investition nur €10.00",
      accept: "Akzeptieren",
      decline: "Ablehnen",
      paymentTitle: "RubbelGlück",
      paymentAmount: "Betrag: €10.00",
      paymentInfo: "Um Ihre Zahlung abzuschließen, überweisen Sie bitte €10 auf folgendes Konto:",
      paymentNote: "Nach der Zahlung erhalten Sie sofort Ihr Online-Kratzlos.",
      yourTicket: "Ihr Lotterielos",
      yourNumber: "Ihre Nummer:",
      scratchInstruction: "Kratze, um deine Nummer zu sehen",
      scratched: "gekratzt",
      scratchCanvasText: "HIER KRATZEN"
    }
  };

  function translatePage() {
    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
    });

    // Përditëso tekstin në canvas nëse ekziston
    const canvas = document.getElementById("scratch-canvas");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#999";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "18px Arial";
      ctx.fillStyle = "#555";
      ctx.textAlign = "center";
      ctx.fillText(translations[currentLang].scratchCanvasText, canvas.width / 2, canvas.height / 2 + 6);
    }
  }

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      langButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      translatePage();
    });
  });

  acceptBtn.addEventListener("click", () => {
    landingView.classList.remove("active");
    paymentView.classList.add("active");
  });

  confirmBtn.addEventListener("click", () => {
    paymentView.classList.remove("active");
    scratchView.classList.add("active");
    initScratch();
  });

  function initScratch() {
    const canvas = document.getElementById("scratch-canvas");
    const ctx = canvas.getContext("2d");
    const resultDiv = document.getElementById("scratch-result");
    const numberDisplay = document.getElementById("user-number");
    const progressFill = document.getElementById("progress-fill");
    const progressPercent = document.getElementById("progress-percent");

    canvas.width = 200;
    canvas.height = 100;

    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "18px Arial";
    ctx.fillStyle = "#555";
    ctx.textAlign = "center";
    ctx.fillText(translations[currentLang].scratchCanvasText, canvas.width / 2, canvas.height / 2 + 6);

    let isDrawing = false;
    let totalPixels = canvas.width * canvas.height;
    let revealed = false;

    const userNumber = Math.floor(Math.random() * 100) + 1;
    numberDisplay.textContent = "??";

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function erase(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fill();

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) transparentPixels++;
      }

      let percent = Math.min(100, Math.round((transparentPixels / totalPixels) * 100));
      progressFill.style.width = percent + "%";
      progressPercent.textContent = percent;

      if (percent > 50 && !revealed) {
        revealed = true;
        numberDisplay.textContent = userNumber;
        resultDiv.classList.remove("hidden");
        if (currentLang === "en") {
          resultDiv.innerHTML = `<p><strong>Your number is: ${userNumber}</strong></p><p>Save your number – the winner will be announced on <strong>31.12.2025</strong> on our Facebook page!</p>`;
        } else {
          resultDiv.innerHTML = `<p><strong>Ihre Nummer ist: ${userNumber}</strong></p><p>Speichern Sie Ihre Nummer – der Gewinner wird am <strong>31.12.2025</strong> auf unserer Facebook-Seite bekannt gegeben!</p>`;
        }
      }
    }

    canvas.addEventListener("mousedown", e => { isDrawing = true; erase(getMousePos(e).x, getMousePos(e).y); });
    canvas.addEventListener("mousemove", e => { if (isDrawing) erase(getMousePos(e).x, getMousePos(e).y); });
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseleave", () => isDrawing = false);
  }

  translatePage(); // Përkthimi fillestar
});
