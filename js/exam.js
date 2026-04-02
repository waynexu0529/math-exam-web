// 数学小博士 - 考试功能模块
document.addEventListener('DOMContentLoaded', function() {
    // 初始化考试
    initExam();
});

// 考试状态管理
const ExamState = {
    currentExam: null,
    currentQuestionIndex: 0,
    userAnswers: [],
    timer: null,
    timeRemaining: 1800, // 30分钟 = 1800秒
    isSubmitted: false
};

// 初始化考试
function initExam() {
    // 检查用户登录状态
    const savedUser = localStorage.getItem('mathExamUser');
    if (!savedUser) {
        alert('请先登录！');
        window.location.href = 'index.html';
        return;
    }
    
    // 加载用户信息
    const user = JSON.parse(savedUser);
    document.getElementById('studentNameDisplay').textContent = user.name;
    
    // 设置开始时间
    const now = new Date();
    document.getElementById('startTimeDisplay').textContent = 
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // 加载考试数据
    loadExamData();
    
    // 绑定事件
    bindExamEvents();
    
    // 开始计时器
    startTimer();
    
    // 显示第一题
    loadQuestion(ExamState.currentQuestionIndex);
    
    // 更新进度
    updateProgress();
    
    console.log('考试初始化完成');
}

// 加载考试数据
function loadExamData() {
    // 从本地存储加载考试数据，如果没有则创建新考试
    const savedExam = localStorage.getItem('currentExam');
    
    if (savedExam) {
        ExamState.currentExam = JSON.parse(savedExam);
        ExamState.userAnswers = ExamState.currentExam.userAnswers || [];
        ExamState.currentQuestionIndex = ExamState.currentExam.currentQuestionIndex || 0;
    } else {
        // 创建新考试（10道题）
        createNewExam(10);
    }
    
    // 更新考试信息显示
    document.getElementById('examProgress').textContent = 
        `第${ExamState.currentQuestionIndex + 1}题 / 共${ExamState.currentExam.totalQuestions}题`;
}

// 创建新考试
function createNewExam(questionCount) {
    // 从题库中随机选择题目
    const allQuestions = getQuestionBank();
    const shuffled = shuffleArray(allQuestions);
    const selectedQuestions = shuffled.slice(0, questionCount);
    
    ExamState.currentExam = {
        id: 'exam_' + Date.now(),
        startTime: new Date().toISOString(),
        questions: selectedQuestions,
        totalQuestions: questionCount,
        userAnswers: [],
        score: 0,
        isCompleted: false
    };
    
    ExamState.userAnswers = new Array(questionCount).fill(null);
    ExamState.currentQuestionIndex = 0;
    
    // 保存到本地存储
    localStorage.setItem('currentExam', JSON.stringify(ExamState.currentExam));
}

// 获取题库
function getQuestionBank() {
    // 这里应该从主应用加载题库
    // 暂时使用硬编码的题目
    return [
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
}

// 绑定考试事件
function bindExamEvents() {
    // 上一题按钮
    document.getElementById('prevQuestion').addEventListener('click', goToPreviousQuestion);
    
    // 下一题按钮
    document.getElementById('nextQuestion').addEventListener('click', goToNextQuestion);
    
    // 交卷按钮
    document.getElementById('submitExam').addEventListener('click', submitExam);
    
    // 返回首页按钮
    const backBtn = document.getElementById('backToHome');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (confirm('考试尚未完成，确定要返回首页吗？')) {
                window.location.href = 'index.html';
            }
        });
    }
}

// 开始计时器
function startTimer() {
    updateTimerDisplay();
    
    ExamState.timer = setInterval(() => {
        ExamState.timeRemaining--;
        updateTimerDisplay();
        
        if (ExamState.timeRemaining <= 0) {
            clearInterval(ExamState.timer);
            alert('考试时间到！');
            submitExam();
        }
    }, 1000);
}

// 更新计时器显示
function updateTimerDisplay() {
    const minutes = Math.floor(ExamState.timeRemaining / 60);
    const seconds = ExamState.timeRemaining % 60;
    document.getElementById('examTimer').textContent = 
        `剩余时间: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 加载题目
function loadQuestion(questionIndex) {
    if (!ExamState.currentExam || !ExamState.currentExam.questions[questionIndex]) {
        console.error('题目加载失败');
        return;
    }
    
    const question = ExamState.currentExam.questions[questionIndex];
    const container = document.getElementById('questionContainer');
    
    // 创建题目HTML
    const questionHTML = `
        <div class="question-header">
            <h2>第 ${questionIndex + 1} 题</h2>
            <div class="question-meta">
                <span class="difficulty difficulty-${question.difficulty}">
                    ${getDifficultyText(question.difficulty)}
                </span>
                <span class="estimated-time">
                    <i class="fas fa-clock"></i> 建议时间: ${question.estimatedTime}秒
                </span>
            </div>
        </div>
        
        <div class="question-text">${question.content}</div>
        
        <ul class="option-list" id="optionList">
            ${question.options.map(option => {
                const isSelected = ExamState.userAnswers[questionIndex] === option.id;
                return `
                    <li class="option-item ${isSelected ? 'selected' : ''}" 
                        data-option="${option.id}"
                        onclick="selectOption('${option.id}')">
                        <span class="option-letter">${option.id}.</span>
                        <span class="option-text">${option.text}</span>
                    </li>
                `;
            }).join('')}
        </ul>
        
        <div class="question-navigation">
            <p class="hint">点击选项选择答案，选中的选项会高亮显示</p>
        </div>
    `;
    
    container.innerHTML = questionHTML;
    
    // 更新进度显示
    document.getElementById('examProgress').textContent = 
        `第${questionIndex + 1}题 / 共${ExamState.currentExam.totalQuestions}题`;
    
    // 更新按钮状态
    updateNavigationButtons();
}

// 选择选项
function selectOption(optionId) {
    const questionIndex = ExamState.currentQuestionIndex;
    ExamState.userAnswers[questionIndex] = optionId;
    
    // 更新当前考试的答案
    ExamState.currentExam.userAnswers[questionIndex] = optionId;
    
    // 保存到本地存储
    localStorage.setItem('currentExam', JSON.stringify(ExamState.currentExam));
    
    // 更新UI
    updateOptionSelection(optionId);
    updateProgress();
}

// 更新选项选择状态
function updateOptionSelection(selectedOptionId) {
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        const optionId = item.getAttribute('data-option');
        if (optionId === selectedOptionId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// 上一题
function goToPreviousQuestion() {
    if (ExamState.currentQuestionIndex > 0) {
        ExamState.currentQuestionIndex--;
        loadQuestion(ExamState.currentQuestionIndex);
        updateProgress();
    }
}

// 下一题
function goToNextQuestion() {
    if (ExamState.currentQuestionIndex < ExamState.currentExam.totalQuestions - 1) {
        ExamState.currentQuestionIndex++;
        loadQuestion(ExamState.currentQuestionIndex);
        updateProgress();
    }
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    prevBtn.disabled = ExamState.currentQuestionIndex === 0;
    
    if (ExamState.currentQuestionIndex === ExamState.currentExam.totalQuestions - 1) {
        nextBtn.textContent = '最后一题';
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-success');
    } else {
        nextBtn.textContent = '下一题';
        nextBtn.classList.remove('btn-success');
        nextBtn.classList.add('btn-primary');
    }
}

// 更新进度
function updateProgress() {
    const progressGrid = document.getElementById('progressGrid');
    if (!progressGrid) return;
    
    let progressHTML = '';
    
    for (let i = 0; i < ExamState.currentExam.totalQuestions; i++) {
        const isCurrent = i === ExamState.currentQuestionIndex;
        const isAnswered = ExamState.userAnswers[i] !== null;
        const isVisited = i <= ExamState.currentQuestionIndex;
        
        let className = 'progress-btn';
        if (isCurrent) className += ' current';
        if (isAnswered) className += ' answered';
        if (!isVisited) className += ' not-visited';
        
        progressHTML += `
            <button class="${className}" 
                    onclick="goToQuestion(${i})"
                    title="第${i + 1}题${isAnswered ? '（已答）' : '（未答）'}">
                ${i + 1}
            </button>
        `;
    }
    
    progressGrid.innerHTML = progressHTML;
}

// 跳转到指定题目
function goToQuestion(questionIndex) {
    if (questionIndex >= 0 && questionIndex < ExamState.currentExam.totalQuestions) {
        ExamState.currentQuestionIndex = questionIndex;
        loadQuestion(questionIndex);
        updateProgress();
    }
}

// 提交考试
function submitExam() {
    if (ExamState.isSubmitted) return;
    
    // 检查是否有未答题目
    const unansweredCount = ExamState.userAnswers.filter(answer => answer === null).length;
    
    if (unansweredCount > 0) {
        if (!confirm(`您还有 ${unansweredCount} 道题目未答，确定要交卷吗？`)) {
            return;
        }
    }
    
    // 停止计时器
    if (ExamState.timer) {
        clearInterval(ExamState.timer);
    }
    
    // 计算分数
    const score = calculateScore();
    
    // 更新考试状态
    ExamState.currentExam.score = score;
    ExamState.currentExam.isCompleted = true;
    ExamState.currentExam.endTime = new Date().toISOString();
    ExamState.isSubmitted = true;
    
    // 保存考试结果
    saveExamResult();
    
    // 显示考试结果
    showExamResult(score);
}

// 计算分数
function calculateScore() {
    let correctCount = 0;
    
    for (let i = 0; i < ExamState.currentExam.questions.length; i++) {
        const question = ExamState.currentExam.questions[i];
        const userAnswer = ExamState.userAnswers[i];
        
        if (userAnswer === question.correctAnswer) {
            correctCount++;
        }
    }
    
    // 每道题10分
    return (correctCount / ExamState.currentExam.totalQuestions * 100).toFixed(1);
}

// 保存考试结果
function saveExamResult() {
    // 保存到考试历史
    const examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]');
    examHistory.push({
        ...ExamState.currentExam,
        userAnswers: [...ExamState.userAnswers]
    });
    
    localStorage.setItem('examHistory', JSON.stringify(examHistory));
    
    // 更新学习统计
    updateLearningStats(ExamState.currentExam.score);
    
    // 保存错题
    saveWrongQuestions();
    
    // 清除当前考试
    localStorage.removeItem('currentExam');
}

// 更新学习统计
function updateLearningStats(score) {
    const stats = JSON.parse(localStorage.getItem('learningStats') || '{}');
    
    stats.totalExams = (stats.totalExams || 0) + 1;
    stats.totalQuestions = (stats.totalQuestions || 0) + ExamState.currentExam.totalQuestions;
    stats.correctAnswers = (stats.correctAnswers || 0) + 
        Math.floor(parseFloat(score) / 100 * ExamState.currentExam.totalQuestions);
    
    // 计算平均分
    if (stats.totalExams > 0) {
        const totalScore = (stats.averageScore || 0) * (stats.totalExams - 1) + parseFloat(score);
        stats.averageScore = (totalScore / stats.totalExams).toFixed(1);
    } else {
        stats.averageScore = parseFloat(score).toFixed(1);
    }
    
    // 更新今日练习
    const today = new Date().toDateString();
    if (stats.lastPracticeDate !== today) {
        stats.todayPractice = 0;
        stats.lastPracticeDate = today;
    }
    stats.todayPractice = (stats.todayPractice || 0) + ExamState.currentExam.totalQuestions;
    
    localStorage.setItem('learningStats', JSON.stringify(stats));
}

// 保存错题
function saveWrongQuestions() {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    
    for (let i = 0; i < ExamState.currentExam.questions.length; i++) {
        const question = ExamState.currentExam.questions[i];
        const userAnswer = ExamState.userAnswers[i];
        
        if (userAnswer !== question.correctAnswer) {
            wrongQuestions.push({
                ...question,
                userAnswer: userAnswer,
                examDate: new Date().toISOString(),
                examId: ExamState.currentExam.id
            });
        }
    }
    
    // 去重
    const uniqueWrongQuestions = Array.from(
        new Map(wrongQuestions.map(q => [q.id, q])).values()
    );
    
    localStorage.setItem('wrongQuestions', JSON.stringify(uniqueWrongQuestions));
}

// 显示考试结果
function showExamResult(score) {
    const correctCount = Math.floor(parseFloat(score) / 100 * ExamState.currentExam.totalQuestions);
    const wrongCount = ExamState.currentExam.totalQuestions - correctCount;
    
    const resultHTML = `
        <div class="exam-result">
            <div class="result-header">
                <h2>考试完成！</h2>
                <p class="result-subtitle">三年级数学考试结果</p>
            </div>
            
            <div class="result-score">
                <div class="score-circle">
                    <span class="score-number">${score}</span>
                    <span class="score-label">分</span>
                </div>
                <p class="score-description">总分100分</p>
            </div>
            
            <div class="result-details">
                <div class="detail-card">
                    <h4>答题情况</h4>
                    <p>总题数: ${ExamState.currentExam.totalQuestions}</p>
                    <p>答对: ${correctCount} 题</p>
                    <p>答错: ${wrongCount} 题</p>
                    <p>正确率: ${score}%</p>
                </div>
                
                <div class="detail-card">
                    <h4>时间统计</h4>
                    <p>开始时间: ${new Date(ExamState.currentExam.startTime).toLocaleTimeString()}</p>
                    <p>结束时间: ${new Date().toLocaleTimeString()}</p>
                    <p>用时: ${Math.floor((1800 - ExamState.timeRemaining) / 60)}分${(1800 - ExamState.timeRemaining) % 60}秒</p>
                </div>
            </div>
            
            <div class="result-actions">
                <button class="btn btn-primary" onclick="reviewExam()">
                    <i class="fas fa-search"></i> 查看答案解析
                </button>
                <button class="btn btn-secondary" onclick="goToHome()">
                    <i class="fas fa-home"></i> 返回首页
                </button>
                <button class="btn btn-info" onclick="goToReport()">
                    <i class="fas fa-chart-bar"></i> 查看学习报告
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('questionContainer').innerHTML = resultHTML;
    
    // 隐藏考试控制按钮
    document.querySelector('.exam-controls').style.display = 'none';
}

// 查看答案解析
function reviewExam() {
    alert('答案解析功能正在开发中...');
}

// 返回首页
function goToHome() {
    window.location.href = 'index.html';
}

// 查看学习报告
function goToReport() {
    window.location.href = 'report.html';
}

// 获取难度文本
function getDifficultyText(difficulty) {
    const difficultyMap = {
        'easy': '简单',
        'medium': '中等',
        'hard': '困难'
    };
    return difficultyMap[difficulty] || difficulty;
}

// 导出到全局
window.selectOption = selectOption;
window.goToQuestion = goToQuestion;
window.reviewExam = reviewExam;
window.goToHome = goToHome;
window.goToReport = goToReport;