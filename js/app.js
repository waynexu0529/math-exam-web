// 数学小博士 - 网页版主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

// 应用状态管理
const AppState = {
    currentUser: null,
    isLoggedIn: false,
    currentExam: null,
    questions: [],
    learningStats: {
        totalQuestions: 0,
        correctAnswers: 0,
        averageScore: 0,
        todayPractice: 0
    }
};

// 初始化应用
function initApp() {
    // 检查本地存储的用户信息
    loadUserFromStorage();
    
    // 初始化题库
    initQuestionBank();
    
    // 绑定事件监听器
    bindEvents();
    
    // 更新UI状态
    updateUI();
}

// 从本地存储加载用户信息
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('mathExamUser');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
        console.log('用户已登录:', AppState.currentUser.name);
    }
}

// 初始化题库（北师大版三年级数学）
function initQuestionBank() {
    AppState.questions = window.mathExamQuestions || [
        {
            id: 1,
            type: 'single_choice',
            content: '235 + 148 = ?',
            options: [
                { id: 'A', text: '373' },
                { id: 'B', text: '383' },
                { id: 'C', text: '393' },
                { id: 'D', text: '403' }
            ],
            correctAnswer: 'B',
            explanation: '235 + 148 = 383',
            knowledgePoints: ['addition', 'three_digit'],
            difficulty: 'easy',
            estimatedTime: 30
        }
    ];
}

// 绑定事件
function bindEvents() {
    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    // 关闭模态框
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideLoginModal);
    }
    
    // 登录表单提交
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 功能卡片点击事件 - 修复版
    document.addEventListener('click', function(e) {
        // 开始考试
        if (e.target.closest('#startExam') || (e.target.id === 'startExam')) {
            e.preventDefault();
            startExam(10);
        }
        
        // 每日练习
        if (e.target.closest('#dailyPractice') || (e.target.id === 'dailyPractice')) {
            e.preventDefault();
            startDailyPractice();
        }
        
        // 学习报告
        if (e.target.closest('#viewReport') || (e.target.id === 'viewReport')) {
            e.preventDefault();
            showLearningReport();
        }
        
        // 错题本
        if (e.target.closest('#wrongQuestions') || (e.target.id === 'wrongQuestions')) {
            e.preventDefault();
            showWrongQuestions();
        }
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            hideLoginModal();
        }
    });
}

// 显示登录模态框
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 隐藏登录模态框
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('studentName');
    const gradeInput = document.getElementById('studentGrade');
    
    if (!nameInput || !gradeInput) return;
    
    const name = nameInput.value.trim();
    const grade = gradeInput.value;
    
    if (!name || !grade) {
        alert('请填写姓名和选择年级！');
        return;
    }
    
    // 保存用户信息
    AppState.currentUser = { name, grade };
    AppState.isLoggedIn = true;
    localStorage.setItem('mathExamUser', JSON.stringify(AppState.currentUser));
    
    // 更新UI
    updateUI();
    
    // 隐藏模态框
    hideLoginModal();
    
    alert(`欢迎回来，${name}同学！`);
}

// 开始考试
function startExam(questionCount = 10) {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 创建考试对象
    AppState.currentExam = {
        id: 'exam_' + Date.now(),
        startTime: new Date(),
        questions: getRandomQuestions(questionCount),
        currentQuestionIndex: 0,
        userAnswers: [],
        score: 0,
        totalQuestions: questionCount
    };
    
    // 保存考试状态
    localStorage.setItem('currentExam', JSON.stringify(AppState.currentExam));
    
    // 跳转到考试页面
    window.location.href = 'exam.html';
    
    console.log('开始考试:', AppState.currentExam);
}

// 获取随机题目
function getRandomQuestions(count) {
    const shuffled = [...AppState.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 开始每日练习
function startDailyPractice() {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 每日练习固定5道题
    startExam(5);
}

// 显示学习报告
function showLearningReport() {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 跳转到报告页面
    window.location.href = 'report.html';
}

// 显示错题本
function showWrongQuestions() {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 跳转到报告页面
    window.location.href = 'report.html?tab=wrong';
}

// 更新UI
function updateUI() {
    // 更新用户信息显示
    const userInfo = document.getElementById('userInfo');
    if (userInfo && AppState.isLoggedIn && AppState.currentUser) {
        userInfo.textContent = `欢迎，${AppState.currentUser.name}（${AppState.currentUser.grade}年级）`;
    }
}

// 导出到全局
window.AppState = AppState;
window.mathExamApp = {
    initApp,
    startExam,
    startDailyPractice,
    showLearningReport,
    showWrongQuestions
};
