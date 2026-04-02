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
        },
        {
            id: 11,
            type: 'single_choice',
            content: '456 - 289 = ?',
            options: [
                { id: 'A', text: '157' },
                { id: 'B', text: '167' },
                { id: 'C', text: '177' },
                { id: 'D', text: '187' }
            ],
            correctAnswer: 'B',
            explanation: '456 - 289 = 167。可以用竖式计算或分步计算：456 - 200 = 256，256 - 89 = 167。',
            knowledgePoints: ['subtraction', 'three_digit'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 12,
            type: 'single_choice',
            content: '一本书有120页，小红已经看了5天，每天看12页，还剩多少页没看？',
            options: [
                { id: 'A', text: '50页' },
                { id: 'B', text: '60页' },
                { id: 'C', text: '70页' },
                { id: 'D', text: '80页' }
            ],
            correctAnswer: 'B',
            explanation: '已看：12 × 5 = 60页，还剩：120 - 60 = 60页。',
            knowledgePoints: ['multiplication', 'subtraction', 'word_problems'],
            difficulty: 'medium',
            estimatedTime: 45
        },
        {
            id: 13,
            type: 'single_choice',
            content: '7 × 8 = ?',
            options: [
                { id: 'A', text: '54' },
                { id: 'B', text: '56' },
                { id: 'C', text: '58' },
                { id: 'D', text: '63' }
            ],
            correctAnswer: 'B',
            explanation: '7 × 8 = 56。可以记住口诀：七八五十六。',
            knowledgePoints: ['multiplication', 'multiplication_table'],
            difficulty: 'easy',
            estimatedTime: 25
        },
        {
            id: 14,
            type: 'single_choice',
            content: '一个长方形长10厘米，宽6厘米，它的面积是多少平方厘米？',
            options: [
                { id: 'A', text: '16' },
                { id: 'B', text: '32' },
                { id: 'C', text: '60' },
                { id: 'D', text: '100' }
            ],
            correctAnswer: 'C',
            explanation: '长方形面积 = 长 × 宽 = 10 × 6 = 60平方厘米。',
            knowledgePoints: ['area', 'rectangle', 'multiplication'],
            difficulty: 'medium',
            estimatedTime: 35
        },
        {
            id: 15,
            type: 'single_choice',
            content: '下面哪个数最接近500？',
            options: [
                { id: 'A', text: '398' },
                { id: 'B', text: '456' },
                { id: 'C', text: '512' },
                { id: 'D', text: '589' }
            ],
            correctAnswer: 'C',
            explanation: '500 - 398 = 102，500 - 456 = 44，512 - 500 = 12，589 - 500 = 89。所以512最接近500。',
            knowledgePoints: ['number_sense', 'estimation'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 16,
            type: 'single_choice',
            content: '72 ÷ 9 = ?',
            options: [
                { id: 'A', text: '6' },
                { id: 'B', text: '7' },
                { id: 'C', text: '8' },
                { id: 'D', text: '9' }
            ],
            correctAnswer: 'C',
            explanation: '72 ÷ 9 = 8。可以用口诀：九八七十二。',
            knowledgePoints: ['division', 'division_table'],
            difficulty: 'easy',
            estimatedTime: 25
        },
        {
            id: 17,
            type: 'single_choice',
            content: '小华有36颗糖，分给9个小朋友，每人能分到几颗？',
            options: [
                { id: 'A', text: '3颗' },
                { id: 'B', text: '4颗' },
                { id: 'C', text: '5颗' },
                { id: 'D', text: '6颗' }
            ],
            correctAnswer: 'B',
            explanation: '36 ÷ 9 = 4，所以每人能分到4颗糖。',
            knowledgePoints: ['division', 'equal_distribution'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 18,
            type: 'single_choice',
            content: '下面哪个角是直角？',
            options: [
                { id: 'A', text: '30度的角' },
                { id: 'B', text: '60度的角' },
                { id: 'C', text: '90度的角' },
                { id: 'D', text: '120度的角' }
            ],
            correctAnswer: 'C',
            explanation: '直角是90度的角。',
            knowledgePoints: ['angles', 'geometry'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 19,
            type: 'single_choice',
            content: '一个正方形的周长是20厘米，它的边长是多少厘米？',
            options: [
                { id: 'A', text: '4厘米' },
                { id: 'B', text: '5厘米' },
                { id: 'C', text: '10厘米' },
                { id: 'D', text: '20厘米' }
            ],
            correctAnswer: 'B',
            explanation: '正方形边长 = 周长 ÷ 4 = 20 ÷ 4 = 5厘米。',
            knowledgePoints: ['perimeter', 'square', 'division'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 20,
            type: 'single_choice',
            content: '569 + 348 = ?',
            options: [
                { id: 'A', text: '807' },
                { id: 'B', text: '817' },
                { id: 'C', text: '907' },
                { id: 'D', text: '917' }
            ],
            correctAnswer: 'D',
            explanation: '569 + 348 = 917。可以分步计算：500 + 300 = 800，60 + 40 = 100，9 + 8 = 17，800 + 100 + 17 = 917。',
            knowledgePoints: ['addition', 'three_digit'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 21,
            type: 'single_choice',
            content: '5 × 6 + 7 = ?',
            options: [
                { id: 'A', text: '35' },
                { id: 'B', text: '37' },
                { id: 'C', text: '42' },
                { id: 'D', text: '47' }
            ],
            correctAnswer: 'B',
            explanation: '先算乘法：5 × 6 = 30，再算加法：30 + 7 = 37。',
            knowledgePoints: ['mixed_operations', 'order_of_operations'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 22,
            type: 'single_choice',
            content: '一根绳子长24米，剪成4段，每段长多少米？',
            options: [
                { id: 'A', text: '4米' },
                { id: 'B', text: '5米' },
                { id: 'C', text: '6米' },
                { id: 'D', text: '8米' }
            ],
            correctAnswer: 'C',
            explanation: '24 ÷ 4 = 6，所以每段长6米。',
            knowledgePoints: ['division', 'equal_parts'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 23,
            type: 'single_choice',
            content: '下面哪个分数最大？',
            options: [
                { id: 'A', text: '1/2' },
                { id: 'B', text: '1/3' },
                { id: 'C', text: '1/4' },
                { id: 'D', text: '1/5' }
            ],
            correctAnswer: 'A',
            explanation: '分母越小，分数越大。所以1/2最大。',
            knowledgePoints: ['fractions', 'comparison'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 24,
            type: 'single_choice',
            content: '商店有48个苹果，每6个装一盒，可以装几盒？',
            options: [
                { id: 'A', text: '6盒' },
                { id: 'B', text: '7盒' },
                { id: 'C', text: '8盒' },
                { id: 'D', text: '9盒' }
            ],
            correctAnswer: 'C',
            explanation: '48 ÷ 6 = 8，可以装8盒。',
            knowledgePoints: ['division', 'grouping'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 25,
            type: 'single_choice',
            content: '12 × 5 = ?',
            options: [
                { id: 'A', text: '50' },
                { id: 'B', text: '55' },
                { id: 'C', text: '60' },
                { id: 'D', text: '65' }
            ],
            correctAnswer: 'C',
            explanation: '12 × 5 = 60。可以用10 × 5 = 50，2 × 5 = 10，50 + 10 = 60。',
            knowledgePoints: ['multiplication', 'strategies'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 26,
            type: 'single_choice',
            content: '一个班有40名学生，其中女生24名，男生有多少名？',
            options: [
                { id: 'A', text: '14名' },
                { id: 'B', text: '16名' },
                { id: 'C', text: '18名' },
                { id: 'D', text: '20名' }
            ],
            correctAnswer: 'B',
            explanation: '40 - 24 = 16，所以男生有16名。',
            knowledgePoints: ['subtraction', 'word_problems'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 27,
            type: 'single_choice',
            content: '下面哪个图形有4条边？',
            options: [
                { id: 'A', text: '三角形' },
                { id: 'B', text: '四边形' },
                { id: 'C', text: '五边形' },
                { id: 'D', text: '圆形' }
            ],
            correctAnswer: 'B',
            explanation: '四边形有4条边。',
            knowledgePoints: ['shapes', 'polygon'],
            difficulty: 'easy',
            estimatedTime: 25
        },
        {
            id: 28,
            type: 'single_choice',
            content: '800 - 356 = ?',
            options: [
                { id: 'A', text: '434' },
                { id: 'B', text: '444' },
                { id: 'C', text: '454' },
                { id: 'D', text: '464' }
            ],
            correctAnswer: 'B',
            explanation: '800 - 356 = 444。',
            knowledgePoints: ['subtraction', 'three_digit'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 29,
            type: 'single_choice',
            content: '一个长方形长12厘米，宽5厘米，周长是多少厘米？',
            options: [
                { id: 'A', text: '17厘米' },
                { id: 'B', text: '24厘米' },
                { id: 'C', text: '34厘米' },
                { id: 'D', text: '60厘米' }
            ],
            correctAnswer: 'C',
            explanation: '周长 = (长 + 宽) × 2 = (12 + 5) × 2 = 34厘米。',
            knowledgePoints: ['perimeter', 'rectangle'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 30,
            type: 'single_choice',
            content: '9 × 9 = ?',
            options: [
                { id: 'A', text: '72' },
                { id: 'B', text: '81' },
                { id: 'C', text: '90' },
                { id: 'D', text: '99' }
            ],
            correctAnswer: 'B',
            explanation: '9 × 9 = 81。可以记住口诀：九九八十一。',
            knowledgePoints: ['multiplication', 'multiplication_table'],
            difficulty: 'easy',
            estimatedTime: 25
        }
    ];
    
    // 添加章节信息到每道题
    AppState.questions = AppState.questions.map(q => {
        const chapterMap = {
            1: ['ch3'], 2: ['ch3'], 3: ['ch4'], 4: ['ch5'], 5: ['ch2'],
            6: ['ch1'], 7: ['ch5'], 8: ['ch7'], 9: ['ch4'], 10: ['ch7'],
            11: ['ch3'], 12: ['ch1', 'ch4'], 13: ['ch6'], 14: ['ch5'], 15: ['ch3'],
            16: ['ch4'], 17: ['ch4'], 18: ['ch2'], 19: ['ch5'], 20: ['ch3'],
            21: ['ch1'], 22: ['ch4'], 23: ['ch10'], 24: ['ch4'], 25: ['ch6'],
            26: ['ch3'], 27: ['ch2'], 28: ['ch3'], 29: ['ch5'], 30: ['ch6']
        };
        return { ...q, chapters: chapterMap[q.id] || ['ch1'] };
    });
    
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
// 开始考试（带章节选择）
function startExam(questionCount = 10) {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 显示章节选择界面
    showChapterSelection(questionCount, true); // true表示可多选
}

// 获取随机题目
function getRandomQuestions(count, questionPool = null) {
    const pool = questionPool || AppState.questions;
    // 使用正确的Fisher-Yates洗牌算法
    const shuffled = MathExamUtils.shuffleArray([...pool]);
    return shuffled.slice(0, count);
}

// 开始每日练习
function startDailyPractice() {
    if (!AppState.isLoggedIn) {
        showLoginModal();
        return;
    }
    
    // 显示章节选择界面
    showChapterSelection(5, false); // false表示单选
}

// 显示章节选择界面
function showChapterSelection(questionCount, multiSelect) {
    const modal = document.createElement('div');
    modal.className = 'chapter-modal';
    modal.id = 'chapterModal';
    
    const chapters = ChapterSystem.chapters;
    
    modal.innerHTML = `
        <div class="chapter-modal-content">
            <div class="chapter-modal-header">
                <h2><i class="fas fa-book"></i> 选择章节</h2>
                <p class="chapter-subtitle">${multiSelect ? '可以选择多个章节（至少选1个）' : '请选择一个章节'}</p>
                <span class="chapter-close" onclick="closeChapterModal()">&times;</span>
            </div>
            
            <div class="chapter-grid">
                ${chapters.map(chapter => {
                    const count = AppState.questions.filter(q => 
                        q.chapters && q.chapters.includes(chapter.id)
                    ).length;
                    
                    return `
                        <div class="chapter-card" data-chapter="${chapter.id}" onclick="toggleChapter('${chapter.id}', ${multiSelect})">
                            <div class="chapter-icon">${chapter.icon}</div>
                            <div class="chapter-name">${chapter.name}</div>
                            <div class="chapter-count">${count}道题</div>
                            <div class="chapter-checkbox">
                                <i class="fas fa-check"></i>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="chapter-footer">
                <button class="btn btn-secondary" onclick="closeChapterModal()">
                    <i class="fas fa-times"></i> 取消
                </button>
                <button class="btn btn-primary" onclick="confirmChapterSelection(${questionCount})">
                    <i class="fas fa-check"></i> 开始答题
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 动画显示
    setTimeout(() => modal.classList.add('show'), 10);
}

// 选择/取消章节
window.selectedChapters = new Set();
window.toggleChapter = function(chapterId, multiSelect) {
    const card = document.querySelector(`[data-chapter="${chapterId}"]`);
    
    if (multiSelect) {
        // 多选模式
        if (window.selectedChapters.has(chapterId)) {
            window.selectedChapters.delete(chapterId);
            card.classList.remove('selected');
        } else {
            window.selectedChapters.add(chapterId);
            card.classList.add('selected');
        }
    } else {
        // 单选模式
        document.querySelectorAll('.chapter-card').forEach(c => c.classList.remove('selected'));
        window.selectedChapters.clear();
        window.selectedChapters.add(chapterId);
        card.classList.add('selected');
    }
};

// 确认章节选择并开始考试
window.confirmChapterSelection = function(questionCount) {
    if (window.selectedChapters.size === 0) {
        alert('请至少选择一个章节！');
        return;
    }
    
    const selectedChapterIds = Array.from(window.selectedChapters);
    
    // 根据选择的章节过滤题目
    const filteredQuestions = ChapterSystem.getQuestionsByChapters(
        AppState.questions,
        selectedChapterIds
    );
    
    if (filteredQuestions.length < questionCount) {
        alert(`所选章节的题目数量不足！\n当前有${filteredQuestions.length}道题，需要${questionCount}道题。\n请多选几个章节。`);
        return;
    }
    
    // 关闭章节选择
    closeChapterModal();
    
    // 创建考试对象
    AppState.currentExam = {
        id: 'exam_' + Date.now(),
        startTime: new Date(),
        questions: getRandomQuestions(questionCount, filteredQuestions),
        currentQuestionIndex: 0,
        userAnswers: [],
        score: 0,
        totalQuestions: questionCount,
        selectedChapters: selectedChapterIds
    };
    
    // 保存考试状态
    localStorage.setItem('currentExam', JSON.stringify(AppState.currentExam));
    
    // 跳转到考试页面
    window.location.href = 'exam.html';
    
    console.log('开始考试:', AppState.currentExam);
};

// 关闭章节选择
window.closeChapterModal = function() {
    const modal = document.getElementById('chapterModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    window.selectedChapters.clear();
};

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
    
    // 跳转到错题本页面
    window.location.href = 'wrong-questions.html';
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
