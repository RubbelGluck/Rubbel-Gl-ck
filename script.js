// Translations
const translations = {
  en: {
    title: "Win Big!",
    prizeRange: "Try your luck and win 50,000–100,000",
    prizePool: "Total prize pool: €4,000,000",
    investment: "Entry fee: Only €10",
    accept: "Accept",
    decline: "Decline",
    paymentTitle: "Complete Your Payment",
    paymentAmount: "Amount: €10.00",
    paymentInstructions:
      "To complete your payment, please transfer €10 to the IBAN and then send us an email to confirm your payment.",
    yourTicket: "Your Lottery Ticket",
    yourNumber: "Your Number:",
    scratchInstruction: "Scratch to reveal your number",
    scratched: "scratched",
    congratulations: "Congratulations!",
    youWon: "You Won",
    winMessage:
      "Your winning number has been verified! The prize will be transferred to your account within 5-7 business days.",
    betterLuck: "Better Luck Next Time",
    loseMessage: "This is not the winning number. Thank you for participating!",
    playAgain: "Play Again",
  },
  de: {
    title: "Groß Gewinnen!",
    prizeRange: "Versuchen Sie Ihr Glück und gewinnen Sie 50.000–100.000",
    prizePool: "Gesamter Preispool: €4.000.000",
    investment: "Teilnahmegebühr: Nur €10",
    accept: "Akzeptieren",
    decline: "Ablehnen",
    paymentTitle: "Zahlung Abschließen",
    paymentAmount: "Betrag: €10,00",
    paymentInstructions:
      "Bitte überweisen Sie €10 auf das IBAN und senden Sie uns anschließend eine E-Mail zur Bestätigung Ihrer Zahlung.",
    yourTicket: "Ihr Lottoschein",
    yourNumber: "Ihre Nummer:",
    scratchInstruction: "Kratzen Sie, um Ihre Nummer zu enthüllen",
    scratched: "gekratzt",
    congratulations: "Herzlichen Glückwunsch!",
    youWon: "Sie Haben Gewonnen",
    winMessage:
      "Ihre Gewinnzahl wurde verifiziert! Der Preis wird innerhalb von 5-7 Werktagen auf Ihr Konto überwiesen.",
    betterLuck: "Viel Glück Beim Nächsten Mal",
    loseMessage: "Dies ist nicht die Gewinnzahl. Vielen Dank für Ihre Teilnahme!",
    playAgain: "Nochmal Spielen",
  },
}

// State
let currentLang = "en"
let userNumber = 0
let isWinner = false
let winAmount = 0
let isScratching = false
let scratchPercentage = 0

// DOM Elements
const views = {
  landing: document.getElementById("landing-view"),
  payment: document.getElementById("payment-view"),
  scratch: document.getElementById("scratch-view"),
  result: document.getElementById("result-view"),
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher()
  setupLandingButtons()
  updateTranslations()
})

// Language Switcher
function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll(".lang-btn")
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang
      langButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      updateTranslations()
    })
  })
}

function updateTranslations() {
  const elements = document.querySelectorAll("[data-translate]")
  elements.forEach((el) => {
    const key = el.dataset.translate
    if (translations[currentLang][key]) {
      if (el.tagName === "INPUT" || el.tagName === "BUTTON") {
        if (el.placeholder !== undefined) {
          el.placeholder = translations[currentLang][key]
        } else {
          el.textContent = translations[currentLang][key]
        }
      } else {
        el.textContent = translations[currentLang][key]
      }
    }
  })

  // Add payment instructions dynamically
  const paymentCard = views.payment.querySelector(".card")
  if (paymentCard) {
    let paymentInstrEl = paymentCard.querySelector(".payment-instructions")
    if (!paymentInstrEl) {
      paymentInstrEl = document.createElement("p")
      paymentInstrEl.classList.add("payment-instructions")
      paymentCard.appendChild(paymentInstrEl)
    }
    paymentInstrEl.textContent = translations[currentLang].paymentInstructions
  }
}

// Landing Buttons
function setupLandingButtons() {
  document.getElementById("accept-btn").addEventListener("click", () => {
    showView("payment")
  })

  document.getElementById("decline-btn").addEventListener("click", () => {
    if (
      confirm(
        currentLang === "en"
          ? "Are you sure you want to decline?"
          : "Möchten Sie wirklich ablehnen?"
      )
    ) {
      window.close()
    }
  })
}

// Show View
function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.remove("active"))
  views[viewName].classList.add("active")
}

// Scratch Card
function initScratchCard() {
  const canvas = document.getElementById("scratch-canvas")
  const ctx = canvas.getContext("2d")
  const numberDisplay = document.getElementById("user-number")
  const progressFill = document.getElementById("progress-fill")
  const progressPercent = document.getElementById("progress-percent")

  numberDisplay.textContent = userNumber.toString().padStart(2, "0")

  const wrapper = canvas.parentElement
  canvas.width = wrapper.offsetWidth
  canvas.height = wrapper.offsetHeight

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, "#64748b")
  gradient.addColorStop(1, "#475569")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
  ctx.font = "bold 24px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2)

  let isDrawing = false

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 30, 0, Math.PI * 2)
    ctx.fill()
    updateProgress()
  }

  function updateProgress() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparent = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++
    }

    scratchPercentage = Math.round((transparent / (pixels.length / 4)) * 100)
    progressFill.style.width = scratchPercentage + "%"
    progressPercent.textContent = scratchPercentage

    if (scratchPercentage >= 70 && !isScratching) {
      isScratching = true
      setTimeout(() => {
        showResult()
      }, 1000)
    }
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true
    scratch(...Object.values(getMousePos(e)))
  })

  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) scratch(...Object.values(getMousePos(e)))
  })

  canvas.addEventListener("mouseup", () => {
    isDrawing = false
  })

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false
  })

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault()
    isDrawing = true
    scratch(...Object.values(getMousePos(e)))
  })

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
    if (isDrawing) scratch(...Object.values(getMousePos(e)))
  })

  canvas.addEventListener("touchend", () => {
    isDrawing = false
  })
}

// Show Result
function showResult() {
  const resultContainer = document.getElementById("scratch-result")
  const t = translations[currentLang]

  if (isWinner) {
    resultContainer.innerHTML = `
      <div class="result-icon">🎉</div>
      <h2 class="result-title win">${t.congratulations}</h2>
      <p class="win-amount">€${winAmount.toLocaleString()}</p>
      <h3 class="result-title win">${t.youWon}</h3>
      <p class="result-message">${t.winMessage}</p>
      <button class="btn btn-primary" onclick="location.reload()">${t.playAgain}</button>
    `
  } else {
    resultContainer.innerHTML = `
      <div class="result-icon">😔</div>
      <h2 class="result-title lose">${t.betterLuck}</h2>
      <p class="result-message">${t.loseMessage}</p>
      <button class="btn btn-primary" onclick="location.reload()">${t.playAgain}</button>
    `
  }

  resultContainer.classList.remove("hidden")
}
