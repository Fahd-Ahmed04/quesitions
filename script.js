(function() {
    "use strict";

    // ---------- البيانات الأولية (قاعدة أسئلة وأجوبة) ----------
    const DEFAULT_QUESTIONS = [
        {
            id: 1,
            title: "كيف أشغل الكمبيوتر؟",
            category: "الحاسوب الأساسي",
            summary: "ابحث عن زر صغير مكتوب عليه رمز الدائرة مع الخط في الجانب أو الأمام. اضغط عليه مرة واحدة فقط وانتظر.",
            steps: [
                "ابحث عن زر التشغيل (دائرة مع خط).",
                "اضغط عليه مرة واحدة.",
                "انتظر دقيقة أو دقيقتين حتى تظهر الشاشة الرئيسية."
            ],
            tip: "لا تضغط على الزر بقوة، فقط ضغطة خفيفة."
        },
        {
            id: 2,
            title: "كيف أوقف تشغيل الكمبيوتر بشكل صحيح؟",
            category: "الحاسوب الأساسي",
            summary: "لا تضغط على زر التشغيل مباشرة. استخدم قائمة ابدأ.",
            steps: [
                "انقر على أيقونة 'ابدأ' في أسفل الشاشة.",
                "انقر على أيقونة الطاقة.",
                "اختر 'إيقاف التشغيل'.",
                "انتظر حتى تُطفأ الشاشة تلقائياً."
            ],
            tip: "إيقاف التشغيل الصحيح يحمي جهازك."
        },
        {
            id: 3,
            title: "كيف أرفع صوت الكمبيوتر أو أخفضه؟",
            category: "الحاسوب الأساسي",
            summary: "ابحث عن أيقونة مكبر الصوت في أسفل يمين الشاشة.",
            steps: [
                "انقر على أيقونة مكبر الصوت.",
                "سيظهر شريط تحكم، حركه يميناً لرفع الصوت ويساراً لخفضه."
            ],
            tip: "تأكد من أن السماعات موصولة إذا كنت لا تسمع شيئاً."
        },
        {
            id: 4,
            title: "كيف أفتح برنامج Word؟",
            category: "البرامج والتطبيقات",
            summary: "ابحث عن أيقونة زرقاء مكتوب عليها W.",
            steps: [
                "ابحث على سطح المكتب عن أيقونة Word الزرقاء.",
                "انقر عليها مرتين نقراً سريعاً.",
                "انتظر قليلاً حتى يفتح البرنامج."
            ],
            tip: "إذا لم تجد الأيقونة، ابحث في قائمة ابدأ."
        },
        {
            id: 5,
            title: "كيف أحفظ ملفاً في Word؟",
            category: "البرامج والتطبيقات",
            summary: "استخدم أمر 'حفظ' من قائمة ملف.",
            steps: [
                "انقر على 'ملف' في الأعلى.",
                "اختر 'حفظ'.",
                "اختر مكان الحفظ واكتب اسماً للملف.",
                "انقر 'حفظ'."
            ],
            tip: "احفظ عملك باستمرار حتى لا تفقده."
        },
        {
            id: 6,
            title: "كيف أبحث عن شيء على الإنترنت؟",
            category: "الإنترنت والتواصل",
            summary: "افتح المتصفح واكتب ما تريد في شريط البحث.",
            steps: [
                "افتح متصفح Chrome أو Edge.",
                "في شريط العنوان اكتب google.com ثم اضغط Enter.",
                "في مربع بحث جوجل اكتب ما تريد البحث عنه.",
                "اضغط Enter وستظهر النتائج."
            ],
            tip: "يمكنك استخدام كلمات بسيطة بالعربية."
        },
        {
            id: 7,
            title: "كيف أرسل صورة على الواتساب؟",
            category: "الإنترنت والتواصل",
            summary: "افتح محادثة الشخص وانقر على أيقونة المشبك لإرفاق الصورة.",
            steps: [
                "افتح واتساب واذهب إلى المحادثة المطلوبة.",
                "انقر على أيقونة المشبك (إرفاق).",
                "اختر 'الصور' ثم حدد الصورة.",
                "انقر على زر الإرسال (السهم الأخضر)."
            ],
            tip: "تأكد من اتصالك بالإنترنت قبل الإرسال."
        }
    ];

    // ---------- متغيرات عامة ----------
    let questions = [];
    const STORAGE_KEY = 'askAndLearnQuestions';

    // عناصر DOM
    const homeSection = document.getElementById('home');
    const categoriesSection = document.getElementById('categories');
    const addQuestionSection = document.getElementById('add-question');
    const answerSection = document.getElementById('answerSection');
    
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');

    const searchInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestionsList');
    const popularQuestionsList = document.getElementById('popularQuestionsList');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const categoryQuestionsList = document.getElementById('categoryQuestionsList');

    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const answerQuestionTitle = document.getElementById('answerQuestionTitle');
    const answerSummary = document.getElementById('answerSummary');
    const answerSteps = document.getElementById('answerSteps');
    const answerTip = document.getElementById('answerTip');
    const rateYesBtn = document.getElementById('rateYesBtn');
    const rateNoBtn = document.getElementById('rateNoBtn');
    const feedbackMessage = document.getElementById('feedbackMessage');

    const submitQuestionBtn = document.getElementById('submitQuestionBtn');
    const newQuestionTitle = document.getElementById('newQuestionTitle');
    const newQuestionDetails = document.getElementById('newQuestionDetails');
    const addQuestionMessage = document.getElementById('addQuestionMessage');

    let currentQuestionId = null;

    // ---------- دوال التخزين ----------
    function loadQuestions() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                questions = JSON.parse(stored);
            } catch(e) {
                questions = [...DEFAULT_QUESTIONS];
            }
        } else {
            questions = [...DEFAULT_QUESTIONS];
        }
        saveQuestions();
    }

    function saveQuestions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }

    // ---------- دوال العرض ----------
    function renderPopularQuestions() {
        // عرض أول 5 أسئلة كأكثر شيوعاً
        const popular = questions.slice(0, 5);
        popularQuestionsList.innerHTML = '';
        popular.forEach(q => {
            const li = document.createElement('li');
            li.className = 'question-item';
            li.innerHTML = `<span class="question-text">${q.title}</span>`;
            li.addEventListener('click', () => showAnswer(q.id));
            popularQuestionsList.appendChild(li);
        });
    }

    function renderCategories() {
        const categoriesSet = new Set(questions.map(q => q.category));
        const categories = Array.from(categoriesSet);
        categoriesContainer.innerHTML = '';
        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.textContent = cat;
            card.addEventListener('click', () => showCategoryQuestions(cat));
            categoriesContainer.appendChild(card);
        });
    }

    function showCategoryQuestions(category) {
        const filtered = questions.filter(q => q.category === category);
        categoryQuestionsList.innerHTML = `<h3>أسئلة ${category}</h3>`;
        if (filtered.length === 0) {
            categoryQuestionsList.innerHTML += '<p>لا توجد أسئلة في هذا التصنيف بعد.</p>';
            return;
        }
        const ul = document.createElement('ul');
        ul.className = 'question-list';
        filtered.forEach(q => {
            const li = document.createElement('li');
            li.className = 'question-item';
            li.innerHTML = `<span class="question-text">${q.title}</span>`;
            li.addEventListener('click', () => showAnswer(q.id));
            ul.appendChild(li);
        });
        categoryQuestionsList.appendChild(ul);
    }

    function showAnswer(questionId) {
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        currentQuestionId = questionId;
        answerQuestionTitle.textContent = question.title;
        answerSummary.textContent = question.summary;

        // خطوات
        answerSteps.innerHTML = '';
        const stepsOl = document.createElement('ol');
        stepsOl.className = 'steps-list';
        question.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsOl.appendChild(li);
        });
        answerSteps.appendChild(stepsOl);

        answerTip.textContent = question.tip || 'تذكر دائماً حفظ عملك.';

        // إخفاء الأقسام الأخرى
        homeSection.classList.remove('active');
        categoriesSection.classList.remove('active');
        addQuestionSection.classList.remove('active');
        answerSection.style.display = 'block';

        // إعادة تعيين التقييم
        feedbackMessage.textContent = '';
        rateYesBtn.classList.remove('selected');
        rateNoBtn.classList.remove('selected');
    }

    function hideAnswer() {
        answerSection.style.display = 'none';
        // تفعيل القسم الرئيسي
        homeSection.classList.add('active');
        categoriesSection.classList.remove('active');
        addQuestionSection.classList.remove('active');
        // تحديث التبويب النشط
        document.querySelector('.nav-tab[data-section="home"]').classList.add('active');
        document.querySelector('.nav-tab[data-section="categories"]').classList.remove('active');
        document.querySelector('.nav-tab[data-section="add-question"]').classList.remove('active');
    }

    // ---------- البحث والاقتراحات ----------
    function updateSuggestions(query) {
        if (query.length < 2) {
            suggestionsList.style.display = 'none';
            return;
        }
        const matched = questions.filter(q => 
            q.title.includes(query) || q.summary.includes(query)
        ).slice(0, 5);
        
        if (matched.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        
        suggestionsList.innerHTML = '';
        matched.forEach(q => {
            const li = document.createElement('li');
            li.textContent = q.title;
            li.addEventListener('click', () => {
                searchInput.value = q.title;
                suggestionsList.style.display = 'none';
                showAnswer(q.id);
            });
            suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = 'block';
    }

    // ---------- إضافة سؤال جديد ----------
    function addNewQuestion(title, details) {
        const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
        const newQuestion = {
            id: newId,
            title: title,
            category: "أسئلة المستخدمين", // تصنيف مؤقت
            summary: details || "لم يتم تقديم تفاصيل إضافية.",
            steps: ["سيتم إضافة الخطوات قريباً بعد المراجعة."],
            tip: "شكراً على سؤالك! فريقنا يعمل على الإجابة."
        };
        questions.push(newQuestion);
        saveQuestions();
        
        // تحديث الواجهات
        renderPopularQuestions();
        renderCategories();
        
        addQuestionMessage.style.display = 'block';
        addQuestionMessage.textContent = 'تم استلام سؤالك بنجاح! سنقوم بمراجعته وإضافته قريباً.';
        
        // تفريغ الحقول
        newQuestionTitle.value = '';
        newQuestionDetails.value = '';
        
        setTimeout(() => {
            addQuestionMessage.style.display = 'none';
        }, 4000);
    }

    // ---------- التبويبات ----------
    function switchTab(sectionId) {
        // إخفاء الكل
        contentSections.forEach(s => s.classList.remove('active'));
        answerSection.style.display = 'none';
        
        // إظهار المطلوب
        if (sectionId === 'home') {
            homeSection.classList.add('active');
        } else if (sectionId === 'categories') {
            categoriesSection.classList.add('active');
            renderCategories();
            categoryQuestionsList.innerHTML = ''; // مسح الأسئلة السابقة
        } else if (sectionId === 'add-question') {
            addQuestionSection.classList.add('active');
        }
        
        // تحديث التبويبات النشطة
        navTabs.forEach(tab => {
            if (tab.dataset.section === sectionId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // ---------- التهيئة ----------
    function init() {
        loadQuestions();
        renderPopularQuestions();
        renderCategories();

        // أحداث التبويبات
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.dataset.section;
                switchTab(sectionId);
            });
        });

        // البحث
        searchInput.addEventListener('input', (e) => {
            updateSuggestions(e.target.value);
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    const matched = questions.find(q => q.title.includes(query));
                    if (matched) {
                        showAnswer(matched.id);
                        searchInput.value = '';
                        suggestionsList.style.display = 'none';
                    } else {
                        alert('لم نجد سؤالاً مطابقاً. جرب كلمات أخرى أو أضف سؤالاً جديداً.');
                    }
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.style.display = 'none';
            }
        });

        // العودة
        backToHomeBtn.addEventListener('click', hideAnswer);

        // تقييم الإجابة
        rateYesBtn.addEventListener('click', () => {
            feedbackMessage.textContent = 'شكراً لك! سعيدون بأن الإجابة أفادتك.';
            rateYesBtn.classList.add('selected');
            rateNoBtn.classList.remove('selected');
        });
        rateNoBtn.addEventListener('click', () => {
            feedbackMessage.textContent = 'نأسف لذلك. سنعمل على تحسين الإجابة. شكراً لملاحظتك.';
            rateNoBtn.classList.add('selected');
            rateYesBtn.classList.remove('selected');
        });

        // إضافة سؤال
        submitQuestionBtn.addEventListener('click', () => {
            const title = newQuestionTitle.value.trim();
            if (!title) {
                alert('الرجاء كتابة السؤال.');
                return;
            }
            const details = newQuestionDetails.value.trim();
            addNewQuestion(title, details);
        });
    }

    init();
})();