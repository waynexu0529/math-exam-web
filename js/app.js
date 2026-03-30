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
        }
    ];
    
    console.log('题库初始化完成，共', AppState.questions.length, '道题目');
}

// 绑定事件监听器
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
    
    // 功能卡片点击事件
    const startExamBtn = document.getElementById('startExam');
    if (startExamBtn) {
        startExamBtn.addEventListener('click', () => startExam(10)); // 10道题
    }
    
    const dailyPracticeBtn = document.getElementById('dailyPractice');
    if (dailyPracticeBtn) {
        dailyPracticeBtn.addEventListener('click', () => startDailyPractice());
    }
    
    const viewReportBtn = document.getElementById('viewReport');
    if (viewReportBtn) {
        viewReportBtn.addEventListener('click', showLearningReport);
    }
    
    const wrongQuestionsBtn = document.getElementById('wrongQuestions');
    if (wrongQuestionsBtn) {
        wrongQuestionsBtn.addEventListener('click', showWrongQuestions);
    }
    
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
        modal.style.display = 'flex';
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
function handleLogin(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('studentName').value;
    const grade = document.getElementById('grade').value;
    
    if (!studentName || !grade) {
        alert('请填写完整信息');
        return;
    }
    
    // 创建用户对象
    AppState.currentUser = {
        id: 'user_' + Date.now(),
        name: studentName,
        grade: parseInt(grade),
        joinDate: new Date().toISOString()
    };
    
    AppState.isLoggedIn = true;
    
    // 保存到本地存储
    localStorage.setItem('mathExamUser', JSON.stringify(AppState.currentUser));
    
    // 更新UI
    updateUI();
    
    // 隐藏模态框
    hideLoginModal();
    
    // 显示欢迎消息
    showNotification(`欢迎回来，${studentName}同学！开始你的数学学习之旅吧！`);
    
    console.log('用户登录成功:', AppState.currentUser);
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
    
    // 跳转到考试页面（这里先模拟）
    showExamPage();
    
    console.log('开始考试:', AppState.currentExam);
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
    
    // 这里应该跳转到报告页面
    alert('学习报告功能正在开发中...');
    
    // 模拟报告数据
    const reportData = {
        totalPractice: AppState.learningStats.totalQuestions,
        correctRate: AppState.learningStats.totalQuestions > 0 
            ? (AppState.learningStats.correctAnswers / AppState.learningStats.totalQuestions * 100).toFixed(1)
            : 0,
        averageScore: AppState.learningStats.averageScore,
        todayPractice: AppState.learningStats.todayPractice
    };
    
    console.log('学习报告:', reportData);
}

// 显示错题本
function showWrongQuestions() {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 从本地存储加载错题
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    
    if (wrongQuestions.length === 0) {
        alert('目前还没有错题，继续保持！');
        return;
    }
    
    alert(`您有 ${wrongQuestions.length} 道错题需要复习`);
    
    // 这里应该跳转到错题本页面
    console.log('错题本:', wrongQuestions);
}

// 显示考试页面
function showExamPage() {
    // 这里应该创建或跳转到考试页面
    // 暂时用alert模拟
    alert(`考试开始！\n共有 ${AppState.currentExam.totalQuestions} 道题目\n请认真作答！`);
    
    // 模拟第一题
    if (AppState.currentExam.questions.length > 0) {
        showQuestion(AppState.currentExam.questions[0]);
    }
}

// 显示题目
function showQuestion(question) {
    // 这里应该渲染题目到页面
    console.log('显示题目:', question);
    
    // 创建题目HTML
    const questionHTML = `
        <div class="question-container">
            <div class="question-text">${question.content}</div>
            <ul class="option-list">
                ${question.options.map(option => `
                    <li class="option-item" data-option="${option.id}">
                        ${option.id}. ${option.text}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // 这里应该将HTML插入到页面中
    // document.getElementById('examContainer').innerHTML = questionHTML;
}

// 获取随机题目
function getRandomQuestions(count) {
    const shuffled = [...AppState.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 更新UI状态
function updateUI() {
    const usernameSpan = document.getElementById('username');
    const loginBtn = document.getElementById('loginBtn');
    
    if (AppState.isLoggedIn && AppState.currentUser) {
        if (usernameSpan) {
            usernameSpan.textContent = AppState.currentUser.name;
        }
        if (loginBtn) {
            loginBtn.textContent = '退出';
            loginBtn.onclick = handleLogout;
        }
    } else {
        if (usernameSpan) {
            usernameSpan.textContent = '游客';
        }
        if (loginBtn) {
            loginBtn.textContent = '登录';
            loginBtn.onclick = showLoginModal;
        }
    }
}

// 处理退出
function handleLogout() {
    if (confirm('确定要退出登录吗？您的学习记录会保存。')) {
        AppState.currentUser = null;
        AppState.isLoggedIn = false;
        localStorage.removeItem('mathExamUser');
        updateUI();
        showNotification('已退出登录');
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#52c41a' : '#1890FF'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 导出到全局（用于调试）
window.AppState = AppState;
window.mathExamApp = {
    initApp,
    startExam,
    showLearningReport,
    showWrongQuestions
};