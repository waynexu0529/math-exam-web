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
    isSubmitted: false,
    correctStreak: 0, // 连续答对数
    totalCorrect: 0, // 总答对数
    encouragements: [
        '太棒了！继续加油！💪',
        '做得很好！👏',
        '你真聪明！🌟',
        '完美答题！✨',
        '继续保持！🎯',
        '非常棒！🎉',
        '你是数学小天才！🌈',
        '干得漂亮！🎪'
    ]
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
    
    // 🚗 初始化零件系统
    PartsSystem.init(ExamState.currentExam.totalQuestions);
    
    // 绑定事件
    bindExamEvents();
    
    // 开始计时器
    startTimer();
    
    // 显示第一题
    loadQuestion(ExamState.currentQuestionIndex);
    
    // 更新进度
    updateProgress();
    
    console.log('考试初始化完成');
    console.log('🚗 零件系统已启动，准备收集零件！');
}

// 加载考试数据
function loadExamData() {
    // 从本地存储加载考试数据，如果没有则创建新考试
    const savedExam = localStorage.getItem('currentExam');
    
    console.log('=== loadExamData 调试信息 ===');
    console.log('localStorage中的currentExam:', savedExam);
    
    if (savedExam) {
        ExamState.currentExam = JSON.parse(savedExam);
        console.log('✅ 从localStorage加载考试数据:', ExamState.currentExam);
        ExamState.userAnswers = ExamState.currentExam.userAnswers || [];
        ExamState.currentQuestionIndex = ExamState.currentExam.currentQuestionIndex || 0;
    } else {
        console.log('⚠️ localStorage中无考试数据，创建新考试');
        // 创建新考试（10道题）
        createNewExam(10);
    }
    
    console.log('最终的ExamState.currentExam:', ExamState.currentExam);
    console.log('题目数量:', ExamState.currentExam ? ExamState.currentExam.questions?.length : 0);
    
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
    console.log('=== loadQuestion 调试信息 ===');
    console.log('questionIndex:', questionIndex);
    console.log('ExamState.currentExam:', ExamState.currentExam);
    console.log('questions数组:', ExamState.currentExam ? ExamState.currentExam.questions : null);
    console.log('questions长度:', ExamState.currentExam && ExamState.currentExam.questions ? ExamState.currentExam.questions.length : 0);
    
    if (!ExamState.currentExam) {
        console.error('❌ ExamState.currentExam 未初始化');
        alert('考试数据未加载，请返回首页重新开始');
        return;
    }
    
    if (!ExamState.currentExam.questions) {
        console.error('❌ ExamState.currentExam.questions 不存在');
        alert('题目数据缺失，请返回首页重新开始');
        return;
    }
    
    if (!ExamState.currentExam.questions[questionIndex]) {
        console.error(`❌ 题目索引 ${questionIndex} 越界（总共 ${ExamState.currentExam.questions.length} 题）`);
        alert(`题目加载失败：索引${questionIndex}超出范围`);
        return;
    }
    
    const question = ExamState.currentExam.questions[questionIndex];
    const container = document.getElementById('questionContainer');
    
    // 更新并保存当前题号
    ExamState.currentExam.currentQuestionIndex = questionIndex;
    localStorage.setItem('currentExam', JSON.stringify(ExamState.currentExam));
    
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
    const question = ExamState.currentExam.questions[questionIndex];
    ExamState.userAnswers[questionIndex] = optionId;
    
    // 更新当前考试的答案
    ExamState.currentExam.userAnswers[questionIndex] = optionId;
    
    // 保存到本地存储
    localStorage.setItem('currentExam', JSON.stringify(ExamState.currentExam));
    
    // 更新UI
    updateOptionSelection(optionId);
    updateProgress();
    
    // 检查答案是否正确
    const isCorrect = optionId === question.correctAnswer;
    
    // 🚗 收集零件
    PartsSystem.collectPart(questionIndex, isCorrect);
    showPartCollectionFeedback(questionIndex, isCorrect);
    
    // 趣味反馈：检查答案是否正确并显示鼓励
    if (isCorrect) {
        ExamState.correctStreak++;
        ExamState.totalCorrect++;
        showEncouragement();
        
        // 连击效果
        if (ExamState.correctStreak >= 3) {
            showStreakEffect(ExamState.correctStreak);
        }
    } else {
        ExamState.correctStreak = 0;
    }
    
    // 添加选择动画
    addSelectionAnimation(optionId);
}

// 🚗 显示零件收集反馈
function showPartCollectionFeedback(questionIndex, isCorrect) {
    const part = PartsSystem.currentParts[questionIndex];
    if (!part) return;
    
    const feedback = document.createElement('div');
    feedback.className = `part-collection-toast ${isCorrect ? 'part-good' : 'part-damaged'}`;
    feedback.innerHTML = `
        <div class="part-icon">${part.icon}</div>
        <div class="part-info">
            <div class="part-name">${part.name}</div>
            <div class="part-status">${isCorrect ? '✅ 完好零件' : '⚠️ 受损零件'}</div>
        </div>
    `;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 2500);
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
    console.log('点击下一题，当前题号:', ExamState.currentQuestionIndex);
    console.log('总题数:', ExamState.currentExam ? ExamState.currentExam.totalQuestions : '未初始化');
    
    if (!ExamState.currentExam) {
        console.error('考试未初始化！');
        alert('考试数据加载失败，请返回首页重新开始');
        return;
    }
    
    if (ExamState.currentQuestionIndex < ExamState.currentExam.totalQuestions - 1) {
        ExamState.currentQuestionIndex++;
        console.log('跳转到题号:', ExamState.currentQuestionIndex);
        loadQuestion(ExamState.currentQuestionIndex);
        updateProgress();
    } else {
        console.log('已是最后一题');
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
    const achievement = showAchievementBadge(parseFloat(score));
    const progress = PartsSystem.getProgress();
    
    const resultHTML = `
        <div class="exam-result">
            <div class="result-header">
                <div class="achievement-badge" style="background: ${achievement.color}">
                    <div class="badge-icon">${achievement.badge}</div>
                    <div class="badge-title">${achievement.message}</div>
                </div>
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
            
            <!-- 🚗 零件收集进度 -->
            <div class="parts-collection-summary">
                <h3><i class="fas fa-wrench"></i> 零件收集情况</h3>
                <div class="parts-stats">
                    <div class="stat-item">
                        <span class="stat-icon">🔧</span>
                        <span class="stat-value">${progress.collected}/${progress.total}</span>
                        <span class="stat-label">已收集</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">✅</span>
                        <span class="stat-value">${progress.good}</span>
                        <span class="stat-label">完好</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⚠️</span>
                        <span class="stat-value">${progress.damaged}</span>
                        <span class="stat-label">受损</span>
                    </div>
                </div>
            </div>
            
            <div class="result-details">
                <div class="detail-card">
                    <h4><i class="fas fa-clipboard-check"></i> 答题情况</h4>
                    <p>📝 总题数: ${ExamState.currentExam.totalQuestions}</p>
                    <p>✅ 答对: ${correctCount} 题</p>
                    <p>❌ 答错: ${wrongCount} 题</p>
                    <p>📊 正确率: ${score}%</p>
                    ${ExamState.correctStreak > 0 ? `<p>🔥 最高连击: ${ExamState.correctStreak}</p>` : ''}
                </div>
                
                <div class="detail-card">
                    <h4><i class="fas fa-clock"></i> 时间统计</h4>
                    <p>🕐 开始时间: ${new Date(ExamState.currentExam.startTime).toLocaleTimeString()}</p>
                    <p>🕑 结束时间: ${new Date().toLocaleTimeString()}</p>
                    <p>⏱️ 用时: ${Math.floor((1800 - ExamState.timeRemaining) / 60)}分${(1800 - ExamState.timeRemaining) % 60}秒</p>
                </div>
            </div>
            
            <div class="result-actions">
                <button class="btn btn-primary btn-large" onclick="showCarGarage()">
                    <i class="fas fa-car"></i> 进入汽车工厂
                </button>
                <button class="btn btn-secondary" onclick="reviewExam()">
                    <i class="fas fa-search"></i> 查看答案解析
                </button>
                <button class="btn btn-info" onclick="goToHome()">
                    <i class="fas fa-home"></i> 返回首页
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('questionContainer').innerHTML = resultHTML;
    
    // 隐藏考试控制按钮
    document.querySelector('.exam-controls').style.display = 'none';
    
    // 显示庆祝动画
    showCelebrationAnimation(parseFloat(score));
}

// 🎊 庆祝动画
function showCelebrationAnimation(score) {
    if (score >= 60) {
        // 创建彩带效果
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 30);
        }
    }
}

// 创建单个彩带
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f'][Math.floor(Math.random() * 5)];
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
}

// 查看答案解析
function reviewExam() {
    if (!ExamState.currentExam || !ExamState.isSubmitted) {
        alert('请先完成考试！');
        return;
    }
    
    // 创建答案解析页面
    const container = document.getElementById('questionContainer');
    
    let reviewHTML = `
        <div class="review-container">
            <div class="review-header">
                <h2><i class="fas fa-check-circle"></i> 答案解析</h2>
                <p class="review-subtitle">查看每道题的详细解答</p>
            </div>
    `;
    
    // 遍历所有题目
    ExamState.currentExam.questions.forEach((question, index) => {
        const userAnswer = ExamState.userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        reviewHTML += `
            <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="review-question-header">
                    <span class="question-number">第 ${index + 1} 题</span>
                    <span class="review-status ${isCorrect ? 'status-correct' : 'status-incorrect'}">
                        <i class="fas fa-${isCorrect ? 'check' : 'times'}-circle"></i>
                        ${isCorrect ? '回答正确' : '回答错误'}
                    </span>
                </div>
                
                <div class="review-question-content">
                    <p class="question-text">${question.content}</p>
                    
                    <div class="review-options">
                        ${question.options.map(option => {
                            let optionClass = 'review-option';
                            if (option.id === question.correctAnswer) {
                                optionClass += ' option-correct';
                            }
                            if (option.id === userAnswer && userAnswer !== question.correctAnswer) {
                                optionClass += ' option-wrong';
                            }
                            
                            return `
                                <div class="${optionClass}">
                                    <span class="option-letter">${option.id}.</span>
                                    <span class="option-text">${option.text}</span>
                                    ${option.id === question.correctAnswer ? '<i class="fas fa-check"></i>' : ''}
                                    ${option.id === userAnswer && userAnswer !== question.correctAnswer ? '<i class="fas fa-times"></i>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="review-answer-info">
                        <div class="answer-row">
                            <strong>你的答案：</strong>
                            <span class="${isCorrect ? 'text-correct' : 'text-incorrect'}">
                                ${userAnswer || '未作答'}
                            </span>
                        </div>
                        <div class="answer-row">
                            <strong>正确答案：</strong>
                            <span class="text-correct">${question.correctAnswer}</span>
                        </div>
                    </div>
                    
                    <div class="review-explanation">
                        <h4><i class="fas fa-lightbulb"></i> 解析</h4>
                        <p>${question.explanation}</p>
                    </div>
                    
                    ${question.knowledgePoints && question.knowledgePoints.length > 0 ? `
                        <div class="review-tags">
                            <strong>知识点：</strong>
                            ${question.knowledgePoints.map(point => 
                                `<span class="knowledge-tag">${point}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    reviewHTML += `
            <div class="review-actions">
                <button class="btn btn-primary" onclick="goToHome()">
                    <i class="fas fa-home"></i> 返回首页
                </button>
                <button class="btn btn-info" onclick="goToReport()">
                    <i class="fas fa-chart-bar"></i> 查看学习报告
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = reviewHTML;
    
    // 隐藏考试控制栏（如果还在显示）
    const controls = document.querySelector('.exam-controls');
    if (controls) {
        controls.style.display = 'none';
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0);
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

// 🎉 趣味功能：显示鼓励语
function showEncouragement() {
    const encouragement = ExamState.encouragements[
        Math.floor(Math.random() * ExamState.encouragements.length)
    ];
    
    const toast = document.createElement('div');
    toast.className = 'encouragement-toast';
    toast.innerHTML = `
        <i class="fas fa-star"></i>
        <span>${encouragement}</span>
    `;
    document.body.appendChild(toast);
    
    // 动画效果
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 🔥 连击效果
function showStreakEffect(streak) {
    const streakDiv = document.createElement('div');
    streakDiv.className = 'streak-effect';
    streakDiv.innerHTML = `
        <div class="streak-icon">🔥</div>
        <div class="streak-text">${streak} 连击！</div>
    `;
    document.body.appendChild(streakDiv);
    
    setTimeout(() => streakDiv.classList.add('show'), 10);
    setTimeout(() => {
        streakDiv.classList.remove('show');
        setTimeout(() => streakDiv.remove(), 300);
    }, 2500);
}

// ✨ 选择动画
function addSelectionAnimation(optionId) {
    const selectedOption = document.querySelector(`[data-option="${optionId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('option-selected-animation');
        setTimeout(() => {
            selectedOption.classList.remove('option-selected-animation');
        }, 600);
    }
}

// 🏆 显示成就徽章
function showAchievementBadge(score) {
    let badge = '';
    let message = '';
    let color = '';
    
    if (score >= 95) {
        badge = '🏆';
        message = '完美大师';
        color = '#ffd700';
    } else if (score >= 85) {
        badge = '🥇';
        message = '优秀学霸';
        color = '#ff6b6b';
    } else if (score >= 75) {
        badge = '🥈';
        message = '良好成绩';
        color = '#c0c0c0';
    } else if (score >= 60) {
        badge = '🥉';
        message = '继续努力';
        color = '#cd7f32';
    } else {
        badge = '💪';
        message = '加油进步';
        color = '#95a5a6';
    }
    
    return { badge, message, color };
}

// 🚗 显示汽车工厂
function showCarGarage() {
    const container = document.getElementById('questionContainer');
    const progress = PartsSystem.getProgress();
    const currentCar = GarageSystem.allCars.find(c => c.id === GarageSystem.selectedCar);
    
    let garageHTML = `
        <div class="car-garage">
            <div class="garage-header">
                <h2><i class="fas fa-warehouse"></i> 汽车工厂</h2>
                <p class="garage-subtitle">组装你的爱车！</p>
            </div>
            
            <div class="current-car-display">
                <div class="car-model">
                    <div class="car-body">
                        <div class="car-icon">${currentCar.icon}</div>
                        <div class="car-name">${currentCar.name}</div>
                    </div>
                </div>
            </div>
            
            <div class="parts-grid">
    `;
    
    // 显示所有零件
    PartsSystem.currentParts.forEach((part, index) => {
        const statusClass = part.status === 'good' ? 'part-good' : 
                          part.status === 'damaged' ? 'part-damaged' : 'part-missing';
        const statusText = part.status === 'good' ? '完好' : 
                          part.status === 'damaged' ? '受损' : '缺失';
        const statusIcon = part.status === 'good' ? '✅' : 
                          part.status === 'damaged' ? '⚠️' : '❌';
        
        garageHTML += `
            <div class="part-card ${statusClass}">
                <div class="part-visual">
                    <span class="part-big-icon">${part.icon}</span>
                    <span class="part-status-badge">${statusIcon}</span>
                </div>
                <div class="part-details">
                    <div class="part-name">${part.name}</div>
                    <div class="part-status-text">${statusText}</div>
                    <div class="part-number">零件 #${part.partId}</div>
                </div>
            </div>
        `;
    });
    
    garageHTML += `
            </div>
            
            <div class="garage-summary">
                <h3>收集完成度</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${(progress.collected / progress.total) * 100}%"></div>
                </div>
                <div class="progress-text">${progress.collected} / ${progress.total} 零件</div>
            </div>
            
            <div class="garage-actions">
                ${progress.collected === progress.total ? `
                    <button class="btn btn-success btn-large" onclick="startCrashTest()">
                        <i class="fas fa-shield-alt"></i> 开始碰撞测试
                    </button>
                ` : `
                    <div class="warning-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        还有 ${progress.total - progress.collected} 个零件未收集，无法进行测试
                    </div>
                `}
                <button class="btn btn-primary" onclick="reviewExam()">
                    <i class="fas fa-search"></i> 查看答案解析
                </button>
                <button class="btn btn-secondary" onclick="goToHome()">
                    <i class="fas fa-home"></i> 返回首页
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = garageHTML;
}

// 🚗 开始碰撞测试
function startCrashTest() {
    const report = CrashTestSystem.generateReport();
    const container = document.getElementById('questionContainer');
    
    // 第一阶段：准备界面
    let crashHTML = `
        <div class="crash-test-container">
            <div class="crash-header">
                <h2><i class="fas fa-car-crash"></i> 碰撞测试准备中...</h2>
                <p class="crash-subtitle">即将开始安全性能检测</p>
            </div>
            
            <div class="crash-animation">
                <div class="countdown-overlay" id="countdownOverlay">
                    <div class="countdown-number" id="countdownNumber">3</div>
                </div>
                
                <div class="car-crash-scene" id="crashScene">
                    <div class="test-car" id="testCar">🚙</div>
                    <div class="crash-wall" id="crashWall">🧱</div>
                </div>
                
                <!-- 飞散的零件容器 -->
                <div class="flying-parts" id="flyingParts"></div>
                
                <!-- 碰撞特效 -->
                <div class="crash-impact" id="crashImpact">💥</div>
            </div>
            
            <!-- 结果区域（初始隐藏） -->
            <div class="crash-result" id="crashResult" style="display: none;">
                <div class="rating-display" id="ratingDisplay" style="background: ${report.rating.color}">
                    <div class="rating-grade">${report.rating.grade}</div>
                    <div class="rating-stars" id="ratingStars">
                        ${'☆'.repeat(5)}
                    </div>
                    <div class="rating-title">${report.rating.title}</div>
                </div>
                
                <div class="crash-details">
                    <h3>测试报告</h3>
                    <div class="test-stats">
                        <div class="test-stat">
                            <span class="stat-label">完好零件:</span>
                            <span class="stat-value">${report.progress.good} / ${report.progress.total}</span>
                        </div>
                        <div class="test-stat">
                            <span class="stat-label">受损零件:</span>
                            <span class="stat-value">${report.progress.damaged}</span>
                        </div>
                        <div class="test-stat">
                            <span class="stat-label">车辆状态:</span>
                            <span class="stat-value ${report.canDrive ? 'status-good' : 'status-bad'}">
                                ${report.canDrive ? '✅ 可以上路' : '❌ 需要维修'}
                            </span>
                        </div>
                    </div>
                    
                    ${report.damagedParts.length > 0 ? `
                        <div class="damaged-parts-list">
                            <h4>需要修复的零件：</h4>
                            <ul>
                                ${report.damagedParts.map(part => `
                                    <li>${part.icon} ${part.name} - 对应题目 #${part.questionIndex + 1}</li>
                                `).join('')}
                            </ul>
                            <p class="repair-hint">💡 提示：查看答案解析并重做错题即可修复零件</p>
                        </div>
                    ` : `
                        <div class="perfect-message">
                            <i class="fas fa-trophy"></i>
                            <p>恭喜！您的车辆完美通过所有测试！</p>
                        </div>
                    `}
                </div>
            </div>
            
            <div class="crash-actions" id="crashActions" style="display: none;">
                <button class="btn btn-primary" onclick="reviewExam()">
                    <i class="fas fa-tools"></i> 修复零件（查看解析）
                </button>
                <button class="btn btn-secondary" onclick="goToHome()">
                    <i class="fas fa-home"></i> 返回首页
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = crashHTML;
    
    // 开始动画序列
    playCrashTestAnimation(report);
}

// 🎬 播放完整碰撞测试动画
function playCrashTestAnimation(report) {
    const countdown = document.getElementById('countdownNumber');
    const countdownOverlay = document.getElementById('countdownOverlay');
    const testCar = document.getElementById('testCar');
    const crashWall = document.getElementById('crashWall');
    const crashImpact = document.getElementById('crashImpact');
    const flyingParts = document.getElementById('flyingParts');
    const crashResult = document.getElementById('crashResult');
    const crashActions = document.getElementById('crashActions');
    
    // 阶段1：倒计时 3、2、1
    let count = 3;
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
            countdown.style.animation = 'none';
            setTimeout(() => {
                countdown.style.animation = 'countPulse 1s ease-out';
            }, 10);
        } else {
            countdown.textContent = 'GO!';
            countdown.style.color = '#52c41a';
            countdown.style.animation = 'countExplode 0.5s ease-out';
            clearInterval(countdownInterval);
            
            // 0.5秒后开始加速
            setTimeout(() => {
                countdownOverlay.style.opacity = '0';
                setTimeout(() => {
                    countdownOverlay.style.display = 'none';
                    startCarAcceleration();
                }, 300);
            }, 500);
        }
    }, 1000);
    
    // 阶段2：车辆加速
    function startCarAcceleration() {
        testCar.classList.add('car-accelerating');
        
        // 1.5秒后碰撞
        setTimeout(() => {
            triggerCrashImpact();
        }, 1500);
    }
    
    // 阶段3：碰撞瞬间
    function triggerCrashImpact() {
        // 车辆碰撞动画
        testCar.classList.remove('car-accelerating');
        testCar.classList.add('car-crashing');
        
        // 墙壁震动
        crashWall.classList.add('wall-shake');
        
        // 碰撞特效
        crashImpact.style.display = 'block';
        crashImpact.classList.add('impact-show');
        
        // 屏幕震动
        document.querySelector('.crash-animation').classList.add('screen-shake');
        
        // 受损零件飞出
        setTimeout(() => {
            showFlyingParts(report.damagedParts);
        }, 300);
        
        // 1秒后显示结果
        setTimeout(() => {
            showTestResults(report);
        }, 2000);
    }
    
    // 阶段4：零件飞散
    function showFlyingParts(damagedParts) {
        damagedParts.forEach((part, index) => {
            setTimeout(() => {
                const partElement = document.createElement('div');
                partElement.className = 'flying-part';
                partElement.textContent = part.icon;
                partElement.style.left = '30%';
                partElement.style.top = '50%';
                
                // 随机飞行方向
                const angle = Math.random() * 360;
                const distance = 100 + Math.random() * 150;
                const x = Math.cos(angle * Math.PI / 180) * distance;
                const y = Math.sin(angle * Math.PI / 180) * distance;
                
                partElement.style.setProperty('--fly-x', `${x}px`);
                partElement.style.setProperty('--fly-y', `${y}px`);
                
                flyingParts.appendChild(partElement);
                
                setTimeout(() => {
                    partElement.classList.add('fly-out');
                }, 50);
                
                // 2秒后移除
                setTimeout(() => {
                    partElement.remove();
                }, 2000);
            }, index * 100);
        });
    }
    
    // 阶段5：显示评分结果
    function showTestResults(report) {
        crashResult.style.display = 'block';
        crashResult.style.animation = 'resultFadeIn 0.8s ease-out';
        
        // 星级逐个点亮
        setTimeout(() => {
            lightUpStars(report.rating.stars);
        }, 500);
        
        // 显示操作按钮
        setTimeout(() => {
            crashActions.style.display = 'flex';
            crashActions.style.animation = 'fadeInUp 0.6s ease-out';
        }, 1500);
    }
    
    // 星级点亮动画
    function lightUpStars(starCount) {
        const starsContainer = document.getElementById('ratingStars');
        let currentStar = 0;
        
        const starInterval = setInterval(() => {
            if (currentStar < starCount) {
                const stars = '⭐'.repeat(currentStar + 1) + '☆'.repeat(5 - currentStar - 1);
                starsContainer.textContent = stars;
                starsContainer.style.animation = 'starPop 0.3s ease-out';
                currentStar++;
            } else {
                clearInterval(starInterval);
            }
        }, 200);
    }
}

// 导出到全局
window.selectOption = selectOption;
window.goToQuestion = goToQuestion;
window.reviewExam = reviewExam;
window.goToHome = goToHome;
window.goToReport = goToReport;
window.showCarGarage = showCarGarage;
window.startCrashTest = startCrashTest;