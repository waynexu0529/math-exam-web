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
    // 使用完整的题库（与exam.js中的getQuestionBank()保持一致）
    AppState.questions = [
        {
            id: 1,
            type: 'single_choice',
            content: '下面哪个数是最大的？',
            options: [
                { id: 'A', text: '256' },
                { id: 'B', text: '302' },
                { id: 'C', text: '198' },
                { id: 'D', text: '275' }
            ],
            correctAnswer: 'B',
            explanation: '302 > 275 > 256 > 198，所以302是最大的。',
            knowledgePoints: ['number_comparison', 'three_digit'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 2,
            type: 'single_choice',
            content: '用数字卡片3、0、5可以组成多少个不同的三位数？',
            options: [
                { id: 'A', text: '3个' },
                { id: 'B', text: '4个' },
                { id: 'C', text: '5个' },
                { id: 'D', text: '6个' }
            ],
            correctAnswer: 'B',
            explanation: '可以组成：305、350、503、530，共4个不同的三位数。0不能放在百位。',
            knowledgePoints: ['number_combination', 'place_value'],
            difficulty: 'medium',
            estimatedTime: 45
        },
        {
            id: 3,
            type: 'single_choice',
            content: '小明有24个苹果，他想平均分给4个小朋友，每个小朋友能得到几个苹果？',
            options: [
                { id: 'A', text: '4个' },
                { id: 'B', text: '6个' },
                { id: 'C', text: '8个' },
                { id: 'D', text: '12个' }
            ],
            correctAnswer: 'B',
            explanation: '24 ÷ 4 = 6，所以每个小朋友能得到6个苹果。',
            knowledgePoints: ['division', 'equal_sharing'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 4,
            type: 'single_choice',
            content: '一个长方形的长是8厘米，宽是5厘米，它的周长是多少厘米？',
            options: [
                { id: 'A', text: '13厘米' },
                { id: 'B', text: '26厘米' },
                { id: 'C', text: '40厘米' },
                { id: 'D', text: '48厘米' }
            ],
            correctAnswer: 'B',
            explanation: '长方形周长 = (长 + 宽) × 2 = (8 + 5) × 2 = 26厘米。',
            knowledgePoints: ['perimeter', 'rectangle'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 5,
            type: 'single_choice',
            content: '下面哪个图形是轴对称图形？',
            options: [
                { id: 'A', text: '平行四边形' },
                { id: 'B', text: '等腰三角形' },
                { id: 'C', text: '直角三角形' },
                { id: 'D', text: '任意三角形' }
            ],
            correctAnswer: 'B',
            explanation: '等腰三角形是轴对称图形，沿着底边上的高对折，两边能完全重合。',
            knowledgePoints: ['symmetry', 'geometric_shapes'],
            difficulty: 'medium',
            estimatedTime: 35
        },
        {
            id: 6,
            type: 'single_choice',
            content: '3 × 7 + 5 = ?',
            options: [
                { id: 'A', text: '26' },
                { id: 'B', text: '36' },
                { id: 'C', text: '46' },
                { id: 'D', text: '56' }
            ],
            correctAnswer: 'A',
            explanation: '先乘除后加减：3 × 7 = 21，21 + 5 = 26。',
            knowledgePoints: ['mixed_operations', 'multiplication'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 7,
            type: 'single_choice',
            content: '一个正方形边长是6厘米，它的面积是多少平方厘米？',
            options: [
                { id: 'A', text: '12' },
                { id: 'B', text: '24' },
                { id: 'C', text: '36' },
                { id: 'D', text: '48' }
            ],
            correctAnswer: 'C',
            explanation: '正方形面积 = 边长 × 边长 = 6 × 6 = 36平方厘米。',
            knowledgePoints: ['area', 'square'],
            difficulty: 'medium',
            estimatedTime: 35
        },
        {
            id: 8,
            type: 'single_choice',
            content: '下面哪个时间表示的是下午3点15分？',
            options: [
                { id: 'A', text: '3:15 AM' },
                { id: 'B', text: '15:15' },
                { id: 'C', text: '3:15 PM' },
                { id: 'D', text: '15:30' }
            ],
            correctAnswer: 'C',
            explanation: '下午3点15分用12小时制表示为3:15 PM，用24小时制表示为15:15。',
            knowledgePoints: ['time', 'clock'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 9,
            type: 'single_choice',
            content: '一箱苹果有48个，平均分给6个班，每个班能分到几个苹果？',
            options: [
                { id: 'A', text: '6个' },
                { id: 'B', text: '7个' },
                { id: 'C', text: '8个' },
                { id: 'D', text: '9个' }
            ],
            correctAnswer: 'C',
            explanation: '48 ÷ 6 = 8，所以每个班能分到8个苹果。',
            knowledgePoints: ['division', 'equal_distribution'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 10,
            type: 'single_choice',
            content: '小明从家到学校要走15分钟，他7:40从家出发，什么时候能到学校？',
            options: [
                { id: 'A', text: '7:55' },
                { id: 'B', text: '8:00' },
                { id: 'C', text: '8:05' },
                { id: 'D', text: '8:10' }
            ],
            correctAnswer: 'A',
            explanation: '7:40 + 15分钟 = 7:55。',
            knowledgePoints: ['time_calculation', 'addition'],
            difficulty: 'easy',
            estimatedTime: 35
        }
    ];
    
    console.log('✅ 题库初始化完成，共', AppState.questions.length, '道题');
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
    const gradeInput = document.getElementById('grade');
    
    console.log('=== 登录调试信息 ===');
    console.log('nameInput:', nameInput);
    console.log('gradeInput:', gradeInput);
    
    if (!nameInput || !gradeInput) {
        console.error('❌ 表单元素未找到');
        alert('表单加载失败，请刷新页面重试');
        return;
    }
    
    const name = nameInput.value.trim();
    const grade = gradeInput.value;
    
    console.log('姓名:', name);
    console.log('年级:', grade);
    
    if (!name || !grade) {
        alert('请填写姓名和选择年级！');
        return;
    }
    
    // 保存用户信息
    AppState.currentUser = { name, grade };
    AppState.isLoggedIn = true;
    localStorage.setItem('mathExamUser', JSON.stringify(AppState.currentUser));
    
    console.log('✅ 用户信息已保存:', AppState.currentUser);
    
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
    // 使用正确的Fisher-Yates洗牌算法
    const shuffled = MathExamUtils.shuffleArray(AppState.questions);
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
