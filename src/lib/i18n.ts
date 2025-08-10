import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      quiz: 'Quiz',
      admin: 'Admin',
      
      // Home page
      welcome: 'Welcome to',
      whoWantsToBeMillionaire: 'Who Wants to Be a Millionaire',
      selectQuiz: 'Select a Quiz to Play',
      noQuizzesAvailable: 'No quizzes available. Create one in the admin panel!',
      playThisQuiz: 'Play This Quiz',
      goToAdmin: 'Go to Admin Panel',
      welcomeToTheHottestQuizGameOnTheWeb: 'WELCOME TO THE HOTTEST QUIZ GAME ON THE WEB!',
      howToPlay: 'HOW TO PLAY',
      answerMultipleChoiceQuestionsCorrectly: 'Answer multiple choice questions correctly',
      eachQuestionHasATimeLimit: 'Each question has a 30-second time limit',
      prizeMoneyIncreasesWithEachCorrectAnswer: 'Prize money increases with each correct answer',
      wrongAnswersEndTheGame: 'Wrong answers end the game',
      walkAwayAnytimeToSecureYourWinnings: 'Walk away anytime to secure your winnings',
      lifelinesHelp: 'LIFELINES',
      useLifelinesToHelp: 'Use lifelines to help you answer difficult questions',
      fiftyFiftyRemovesTwoWrongAnswers: '50:50 removes two wrong answers',
      stopTimerPausesCountdown: 'Stop Timer pauses the countdown',
      callAFriendGivesAdvice: 'Call a Friend gives you advice',
      readyToPlayQuestion: 'Ready to play?',
      selectAQuizBelow: 'Select a quiz below to start your journey to becoming a millionaire!',
      dynamicPrizes: 'DYNAMIC PRIZES',
      prizeAmountsVaryByQuiz: 'Prize amounts vary by quiz',
      safeHavenLevelsProtectWinnings: 'Safe haven levels protect your winnings',
      customDifficultyProgression: 'Custom difficulty progression',
      textAndImageQuestionsSupported: 'Text and image questions supported',
      quizAvailableToPlay: 'quiz available to play',
      quizzesAvailableToPlay: 'quizzes available to play',
      createCustomQuizzes: 'Create custom quizzes with your own questions',
      setYourOwnPrizeAmounts: 'Set your own prize amounts and safe havens',
      supportForTextAndImage: 'Support for text and image questions',
      unlimitedQuizCreation: 'Unlimited quiz creation possibilities',
      professionalAdminPanel: 'Professional admin panel included',
      
      // Quiz gameplay
      startQuiz: 'START QUIZ',
      question: 'Question',
      of: 'of',
      currentPrize: 'CURRENT PRIZE',
      timeLeft: 'TIME LEFT',
      lifelines: 'LIFELINES',
      useEachLifelineOnce: 'Use each lifeline only once per game!',
      fiftyFifty: '50:50',
      stopTimer: 'STOP TIMER',
      callAFriend: 'CALL A FRIEND',
      timerPaused: 'TIMER PAUSED',
      hiddenByFiftyFifty: '[Hidden by 50:50]',
      walkAway: 'WALK AWAY',
      secureWinningsEndGame: 'Secure your winnings and end the game',
      gameRules: 'GAME RULES',
      answerQuestionsCorrectly: 'Answer',
      multipleChoiceQuestions: 'multiple choice questions correctly',
      eachQuestionHasTimeLimit: '• Each question has a 30-second time limit',
      prizeMoneyIncreases: '• Prize money increases with each correct answer',
      wrongAnswersEndGame: '• Wrong answers end the game - you keep guaranteed winnings',
      walkAwayAtAnyTime: '• You can walk away at any time to secure your current prize',
      prizeStructure: 'PRIZE STRUCTURE',
      questionsCorrect: 'questions correct',
      quizChampion: '🏆 QUIZ CHAMPION! 🏆',
      answeredAllQuestionsCorrectly: 'You\'ve answered all questions correctly and',
      wonGrandPrize: 'won the grand prize!',
      
      // Game completion
      congratulations: 'CONGRATULATIONS!',
      gameOver: 'GAME OVER',
      youWon: 'You won',
      finalPrize: 'Final Prize',
      playAgain: 'PLAY AGAIN',
      backToQuizSelection: '← Back to Quiz Selection',
      
      // Lifeline messages
      friendAdvice: 'Your friend says: "I think it might be option A, but I\'m not 100% sure!"',
      
      // Admin panel
      adminPanel: 'Admin Panel',
      overview: 'Overview',
      management: 'Management',
      totalQuizzes: 'Total Quizzes',
      totalQuestions: 'Total Questions',
      createNewQuiz: 'Create New Quiz',
      quizLibrary: 'Quiz Library',
      noQuizzesCreated: 'No quizzes created yet.',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      averageMaxPrize: 'Average Max Prize',
      readyToPlay: 'Ready to Play',
      quickActions: 'QUICK ACTIONS',
      getStartedCreatingManaging: 'Get started with creating and managing your quiz content',
      readyToCreateFirstQuiz: 'Ready to create your first millionaire quiz? Here\'s how to get started:',
      stepOne: '1️⃣ Create Quiz',
      startByCreatingNewQuiz: 'Start by creating a new quiz with a title and description',
      stepTwo: '2️⃣ Add Questions',
      addTextOrImageQuestions: 'Add text or image questions with multiple choice answers',
      stepThree: '3️⃣ Set Prizes',
      setUpPrizeStructure: 'Set up your prize structure and safe haven levels',
      chooseFromCustomQuizzes: 'Choose from your custom quizzes and test your knowledge!',
      createFirstQuizToStart: 'Create your first quiz to start playing!',
      questionContent: 'Question content',
      
      // Quiz creation
      quizTitle: 'Quiz Title',
      quizDescription: 'Quiz Description',
      createQuiz: 'Create Quiz',
      editQuiz: 'Edit Quiz',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      
      // Question management
      addQuestion: 'Add Question',
      editQuestion: 'Edit Question',
      questionText: 'Question Text',
      questionType: 'Question Type',
      textQuestion: 'Text',
      imageQuestion: 'Image',
      imageUrl: 'Image URL',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      answers: 'Answers',
      answerText: 'Answer Text',
      correctAnswer: 'Correct Answer',
      addAnswer: 'Add Answer',
      removeAnswer: 'Remove Answer',
      saveQuestion: 'Save Question',
      
      // Prize configuration
      prizeConfiguration: 'Prize Configuration',
      prizeLevel: 'Prize Level',
      amount: 'Amount',
      safeHaven: 'Safe Haven',
      addPrizeLevel: 'Add Prize Level',
      savePrizes: 'Save Prizes',
      
      // Language selector
      language: 'Language',
      english: 'English',
      polish: 'Polish',
      
      // Quiz selector
      startPlayingNow: 'START PLAYING NOW!',
      selectQuizChallenge: 'SELECT YOUR QUIZ CHALLENGE',
      chooseFromQuizzes: 'Choose from your custom-created quizzes and test your knowledge!',
      questions: 'Questions',
      maxPrize: 'Max Prize',
      safeHavens: 'Safe Havens',
      noQuestionsYet: 'This quiz has no questions yet.',
      addQuestions: 'ADD QUESTIONS',
      tipAddMoreQuestions: 'Tip: Add more questions for a longer challenge!',
      
      // Common
      loading: 'Loading...',
      save: 'Save',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
    }
  },
  pl: {
    translation: {
      // Navigation
      home: 'Strona główna',
      quiz: 'Quiz',
      admin: 'Panel administracyjny',
      
      // Home page
      welcome: 'Witamy w',
      whoWantsToBeMillionaire: 'Milionerzy',
      selectQuiz: 'Wybierz quiz do gry',
      noQuizzesAvailable: 'Brak dostępnych quizów. Utwórz jeden w panelu administracyjnym!',
      playThisQuiz: 'Zagraj w ten quiz',
      goToAdmin: 'Przejdź do panelu administracyjnego',
      welcomeToTheHottestQuizGameOnTheWeb: 'WITAMY W NAJGORĘTSZEJ GRZE QUIZOWEJ W SIECI!',
      howToPlay: 'JAK GRAĆ',
      answerMultipleChoiceQuestionsCorrectly: 'Odpowiadaj poprawnie na pytania wielokrotnego wyboru',
      eachQuestionHasATimeLimit: 'Każde pytanie ma limit czasu 30 sekund',
      prizeMoneyIncreasesWithEachCorrectAnswer: 'Nagroda pieniężna rośnie z każdą poprawną odpowiedzią',
      wrongAnswersEndTheGame: 'Błędne odpowiedzi kończą grę',
      walkAwayAnytimeToSecureYourWinnings: 'Zrezygnuj w dowolnym momencie, aby zabezpieczyć swoje wygrane',
      lifelinesHelp: 'KOŁA RATUNKOWE',
      useLifelinesToHelp: 'Użyj kół ratunkowych, aby pomóc sobie odpowiedzieć na trudne pytania',
      fiftyFiftyRemovesTwoWrongAnswers: '50:50 usuwa dwie błędne odpowiedzi',
      stopTimerPausesCountdown: 'Zatrzymaj czas wstrzymuje odliczanie',
      callAFriendGivesAdvice: 'Zadzwoń do przyjaciela daje ci radę',
      readyToPlayQuestion: 'Gotowy do gry?',
      selectAQuizBelow: 'Wybierz quiz poniżej, aby rozpocząć swoją podróż do zostania milionerem!',
      dynamicPrizes: 'DYNAMICZNE NAGRODY',
      prizeAmountsVaryByQuiz: 'Kwoty nagród różnią się w zależności od quizu',
      safeHavenLevelsProtectWinnings: 'Poziomy gwarantowanych sum chronią twoje wygrane',
      customDifficultyProgression: 'Niestandardowa progresja trudności',
      textAndImageQuestionsSupported: 'Obsługiwane pytania tekstowe i obrazkowe',
      quizAvailableToPlay: 'quiz dostępny do gry',
      quizzesAvailableToPlay: 'quizów dostępnych do gry',
      createCustomQuizzes: 'Twórz niestandardowe quizy z własnymi pytaniami',
      setYourOwnPrizeAmounts: 'Ustaw własne kwoty nagród i gwarantowane sumy',
      supportForTextAndImage: 'Obsługa pytań tekstowych i obrazkowych',
      unlimitedQuizCreation: 'Nieograniczone możliwości tworzenia quizów',
      professionalAdminPanel: 'Profesjonalny panel administracyjny w zestawie',
      
      // Quiz gameplay
      startQuiz: 'ROZPOCZNIJ QUIZ',
      question: 'Pytanie',
      of: 'z',
      currentPrize: 'AKTUALNA NAGRODA',
      timeLeft: 'POZOSTAŁY CZAS',
      lifelines: 'KOŁA RATUNKOWE',
      useEachLifelineOnce: 'Każde koło ratunkowe można użyć tylko raz na grę!',
      fiftyFifty: '50:50',
      stopTimer: 'ZATRZYMAJ CZAS',
      callAFriend: 'TELEFON DO PRZYJACIELA',
      timerPaused: 'CZAS ZATRZYMANY',
      hiddenByFiftyFifty: '[Ukryte przez 50:50]',
      walkAway: 'REZYGNUJĘ',
      secureWinningsEndGame: 'Zabezpiecz swoje wygrane i zakończ grę',
      gameRules: 'ZASADY GRY',
      answerQuestionsCorrectly: 'Odpowiedz na',
      multipleChoiceQuestions: 'pytania wielokrotnego wyboru poprawnie',
      eachQuestionHasTimeLimit: '• Każde pytanie ma limit czasu 30 sekund',
      prizeMoneyIncreases: '• Nagroda pieniężna rośnie z każdą poprawną odpowiedzią',
      wrongAnswersEndGame: '• Błędne odpowiedzi kończą grę - zachowujesz gwarantowane wygrane',
      walkAwayAtAnyTime: '• Możesz zrezygnować w dowolnym momencie, aby zabezpieczyć swoją nagrodę',
      prizeStructure: 'STRUKTURA NAGRÓD',
      questionsCorrect: 'pytań poprawnych',
      quizChampion: '🏆 MISTRZ QUIZU! 🏆',
      answeredAllQuestionsCorrectly: 'Odpowiedziałeś na wszystkie pytania poprawnie i',
      wonGrandPrize: 'wygrałeś główną nagrodę!',
      
      // Game completion
      congratulations: 'GRATULACJE!',
      gameOver: 'KONIEC GRY',
      youWon: 'Wygrałeś',
      finalPrize: 'Końcowa nagroda',
      playAgain: 'ZAGRAJ PONOWNIE',
      backToQuizSelection: '← Powrót do wyboru quizu',
      
      // Lifeline messages
      friendAdvice: 'Twój przyjaciel mówi: "Myślę, że to może być opcja A, ale nie jestem w 100% pewny!"',
      
      // Admin panel
      adminPanel: 'Panel administracyjny',
      overview: 'Przegląd',
      management: 'Zarządzanie',
      totalQuizzes: 'Łączna liczba quizów',
      totalQuestions: 'Łączna liczba pytań',
      createNewQuiz: 'Utwórz nowy quiz',
      quizLibrary: 'Biblioteka quizów',
      noQuizzesCreated: 'Nie utworzono jeszcze żadnych quizów.',
      view: 'Zobacz',
      edit: 'Edytuj',
      delete: 'Usuń',
      averageMaxPrize: 'Średnia maksymalna nagroda',
      readyToPlay: 'Gotowy do gry',
      quickActions: 'SZYBKIE AKCJE',
      getStartedCreatingManaging: 'Zacznij od tworzenia i zarządzania treścią quizu',
      readyToCreateFirstQuiz: 'Gotowy do stworzenia swojego pierwszego quizu milionerów? Oto jak zacząć:',
      stepOne: '1️⃣ Utwórz quiz',
      startByCreatingNewQuiz: 'Zacznij od utworzenia nowego quizu z tytułem i opisem',
      stepTwo: '2️⃣ Dodaj pytania',
      addTextOrImageQuestions: 'Dodaj pytania tekstowe lub obrazkowe z odpowiedziami wielokrotnego wyboru',
      stepThree: '3️⃣ Ustaw nagrody',
      setUpPrizeStructure: 'Skonfiguruj strukturę nagród i poziomy gwarantowanych sum',
      chooseFromCustomQuizzes: 'Wybierz spośród swoich niestandardowych quizów i przetestuj swoją wiedzę!',
      createFirstQuizToStart: 'Utwórz swój pierwszy quiz, aby rozpocząć grę!',
      questionContent: 'Treść pytania',
      
      // Quiz creation
      quizTitle: 'Tytuł quizu',
      quizDescription: 'Opis quizu',
      createQuiz: 'Utwórz quiz',
      editQuiz: 'Edytuj quiz',
      saveChanges: 'Zapisz zmiany',
      cancel: 'Anuluj',
      
      // Question management
      addQuestion: 'Dodaj pytanie',
      editQuestion: 'Edytuj pytanie',
      questionText: 'Tekst pytania',
      questionType: 'Typ pytania',
      textQuestion: 'Tekst',
      imageQuestion: 'Obraz',
      imageUrl: 'URL obrazu',
      difficulty: 'Trudność',
      easy: 'Łatwe',
      medium: 'Średnie',
      hard: 'Trudne',
      answers: 'Odpowiedzi',
      answerText: 'Tekst odpowiedzi',
      correctAnswer: 'Prawidłowa odpowiedź',
      addAnswer: 'Dodaj odpowiedź',
      removeAnswer: 'Usuń odpowiedź',
      saveQuestion: 'Zapisz pytanie',
      
      // Prize configuration
      prizeConfiguration: 'Konfiguracja nagród',
      prizeLevel: 'Poziom nagrody',
      amount: 'Kwota',
      safeHaven: 'Gwarantowana suma',
      addPrizeLevel: 'Dodaj poziom nagrody',
      savePrizes: 'Zapisz nagrody',
      
      // Language selector
      language: 'Język',
      english: 'Angielski',
      polish: 'Polski',
      
      // Quiz selector
      startPlayingNow: 'ZACZNIJ GRAĆ TERAZ!',
      selectQuizChallenge: 'WYBIERZ SWOJE WYZWANIE QUIZOWE',
      chooseFromQuizzes: 'Wybierz spośród swoich niestandardowych quizów i przetestuj swoją wiedzę!',
      questions: 'Pytania',
      maxPrize: 'Maksymalna nagroda',
      safeHavens: 'Gwarantowane sumy',
      noQuestionsYet: 'Ten quiz nie ma jeszcze pytań.',
      addQuestions: 'DODAJ PYTANIA',
      tipAddMoreQuestions: 'Wskazówka: Dodaj więcej pytań dla dłuższego wyzwania!',
      
      // Common
      loading: 'Ładowanie...',
      save: 'Zapisz',
      close: 'Zamknij',
      confirm: 'Potwierdź',
      yes: 'Tak',
      no: 'Nie',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
