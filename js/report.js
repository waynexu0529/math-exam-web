// 数学小博士 - 学习报告模块
document.addEventListener('DOMContentLoaded', function() {
    // 初始化报告
    initReport();
});

// 报告状态管理
const ReportState = {
    user: null,
    stats: null,
    examHistory: [],
    wrongQuestions: [],
    charts: {}
};

// 初始化报告
function initReport() {
    // 检查用户登录状态
    const savedUser = localStorage.getItem('mathExamUser');
    if (!savedUser) {
        alert('请先登录！');
        window.location.href = 'index.html';
        return;
    }
    
    // 加载用户信息
    ReportState.user = JSON.parse(savedUser);
    document.getElementById('reportUsername').textContent = ReportState.user.name;
    
    // 加载数据
    loadReportData();
    
    // 绑定事件
    bindReportEvents();
    
    // 更新报告显示
    updateReportDisplay();
    
    // 初始化图表
    initCharts();
    
    console.log('报告初始化完成');
}

// 加载报告数据
function loadReportData() {
    // 加载学习统计
    ReportState.stats = JSON.parse(localStorage.getItem('learningStats') || '{}');
    
    // 加载考试历史
    ReportState.examHistory = JSON.parse(localStorage.getItem('examHistory') || '[]');
    
    // 加载错题
    ReportState.wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    
    // 设置报告时间
    const now = new Date();
    document.getElementById('reportTime').textContent = 
        `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 绑定报告事件
function bindReportEvents() {
    // 返回首页按钮
    document.getElementById('backToHome').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // 复习所有错题按钮
    const reviewBtn = document.getElementById('reviewAllWrong');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', reviewAllWrongQuestions);
    }
}

// 更新报告显示
function updateReportDisplay() {
    // 更新概览卡片
    document.getElementById('totalPractice').textContent = 
        ReportState.stats.totalQuestions || 0;
    
    document.getElementById('correctRate').textContent = 
        ReportState.stats.totalQuestions > 0 
            ? `${((ReportState.stats.correctAnswers || 0) / ReportState.stats.totalQuestions * 100).toFixed(1)}%`
            : '0%';
    
    document.getElementById('averageScore').textContent = 
        ReportState.stats.averageScore || '0';
    
    document.getElementById('todayPractice').textContent = 
        ReportState.stats.todayPractice || 0;
    
    // 更新优势知识点
    updateStrengthsList();
    
    // 更新薄弱环节
    updateWeaknessesList();
    
    // 更新学习建议

    updateSuggestions();
    
    // 更新错题列表

    updateWrongQuestionsList();
}

// 初始化图表
function initCharts() {
    // 正确率趋势图

    initCorrectRateChart();
    
    // 知识点掌握情况图

    initKnowledgeChart();
    
    // 题目难度分布图

    initDifficultyChart();
    
    // 学习时间分布图

    initTimeChart();
}

// 正确率趋势图

function initCorrectRateChart() {
    const ctx = document.getElementById('correctRateChart');
    if (!ctx) return;
    
    // 获取最近5次考试数据
    const recentExams = ReportState.examHistory.slice(-5);
    const labels = recentExams.map((exam, index) => `第${index + 1}次`);
    const scores = recentExams.map(exam => parseFloat(exam.score));
    
    ReportState.charts.correctRate = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '考试成绩',
                data: scores,
                borderColor: '#1890FF',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '最近5次考试趋势'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '分数'
                    }
                }
            }
        }
    });
}

// 知识点掌握情况图

function initKnowledgeChart() {
    const ctx = document.getElementById('knowledgeChart');
    if (!ctx) return;
    
    // 分析知识点掌握情况

    const knowledgeStats = analyzeKnowledgeMastery();
    
    ReportState.charts.knowledge = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(knowledgeStats),
            datasets: [{
                label: '掌握程度 (%)',
                data: Object.values(knowledgeStats),
                backgroundColor: [
                    '#36CFC9',
                    '#1890FF',
                    '#722ED1',
                    '#FA8C16',
                    '#52C41A'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '知识点掌握情况'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '掌握程度 (%)'
                    }
                }
            }
        }
    });
}

// 题目难度分布图

function initDifficultyChart() {
    const ctx = document.getElementById('difficultyChart');
    if (!ctx) return;
    
    // 分析题目难度分布

    const difficultyStats = analyzeDifficultyDistribution();
    
    ReportState.charts.difficulty = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['简单', '中等', '困难'],
            datasets: [{
                data: [
                    difficultyStats.easy || 0,
                    difficultyStats.medium || 0,
                    difficultyStats.hard || 0
                ],
                backgroundColor: [
                    '#52C41A',
                    '#FA8C16',
                    '#F5222D'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '题目难度分布'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 学习时间分布图

function initTimeChart() {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;
    
    // 分析学习时间分布

    const timeStats = analyzeTimeDistribution();
    
    ReportState.charts.time = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                data: timeStats,
                backgroundColor: [
                    '#1890FF',
                    '#36CFC9',
                    '#722ED1',
                    '#EB2F96',
                    '#FA8C16',
                    '#52C41A',
                    '#13C2C2'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '每周学习时间分布'
                }
            }
        }
    });
}

// 分析知识点掌握情况

function analyzeKnowledgeMastery() {
    const knowledgeStats = {};
    let totalQuestions = 0;
    let correctQuestions = 0;
    
    // 遍历所有考试历史

    ReportState.examHistory.forEach(exam => {
        exam.questions.forEach((question, index) => {
            const userAnswer = exam.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            // 统计每个知识点的掌握情况

            question.knowledgePoints.forEach(kp => {
                if (!knowledgeStats[kp]) {
                    knowledgeStats[kp] = { correct: 0, total: 0 };
                }
                
                knowledgeStats[kp].total++;
                if (isCorrect) {
                    knowledgeStats[kp].correct++;
                }
            });
            
            totalQuestions++;
            if (isCorrect) correctQuestions++;
        });
    });
    
    // 计算掌握程度百分比

    const mastery = {};
    Object.keys(knowledgeStats).forEach(kp => {
        const stat = knowledgeStats[kp];
        mastery[kp] = stat.total > 0 ? (stat.correct / stat.total * 100).toFixed(1) : 0;
    });
    
    return mastery;
}

// 分析题目难度分布

function analyzeDifficultyDistribution() {
    const difficultyStats = { easy: 0, medium: 0, hard: 0 };
    
    ReportState.examHistory.forEach(exam => {
        exam.questions.forEach(question => {
            difficultyStats[question.difficulty]++;
        });
    });
    
    return difficultyStats;
}

// 分析学习时间分布

function analyzeTimeDistribution() {
    const timeStats = [0, 0, 0, 0, 0, 0, 0];
    
    ReportState.examHistory.forEach(exam => {
        const examDate = new Date(exam.startTime);
        const dayOfWeek = examDate.getDay(); // 0=周日,1=周一...
        
        // 转换为周一为第一天

        const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        timeStats[index] += exam.questions.length;
    });
    
    return timeStats;
}

// 更新优势知识点列表

function updateStrengthsList() {
    const strengthsList = document.getElementById('strengthsList');
    if (!strengthsList) return;
    
    const mastery = analyzeKnowledgeMastery();
    
    // 找出掌握程度超过80%的知识点

    const strengths = Object.entries(mastery)
        .filter(([kp, rate]) => parseFloat(rate) >= 80)
        .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
        .slice(0, 5);
    
    if (strengths.length === 0) {
        strengthsList.innerHTML = '<li>暂无优势知识点，继续努力！</li>';
        return;
    }
    
    strengthsList.innerHTML = strengths.map(([kp, rate]) => `
        <li>
            <strong>${getKnowledgePointName(kp)}</strong>
            <span class="rate">${rate}%</span>
        </li>
    `).join('');
}

// 更新薄弱环节列表

function updateWeaknessesList() {
    const weaknessesList = document.getElementById('weaknessesList');
    if (!weaknessesList) return;
    
    const mastery = analyzeKnowledgeMastery();
    
    // 找出掌握程度低于60%的知识点

    const weaknesses = Object.entries(mastery)
        .filter(([kp, rate]) => parseFloat(rate) < 60)
        .sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]))
        .slice(0, 5);
    
    if (weaknesses.length === 0) {
        weaknessesList.innerHTML = '<li>暂无薄弱环节，继续保持！</li>';
        return;
    }
    
    weaknessesList.innerHTML = weaknesses.map(([kp, rate]) => `
        <li>
            <strong>${getKnowledgePointName(kp)}</strong>
            <span class="rate">${rate}%</span>
        </li>
    `).join('');
}

// 更新学习建议

function updateSuggestions() {
    const suggestionsDiv = document.getElementById('suggestions');
    if (!suggestionsDiv) return;
    
    const mastery = analyzeKnowledgeMastery();
    const examCount = ReportState.examHistory.length;
    
    let suggestions = [];
    
    // 根据学习情况生成建议

    if (examCount === 0) {
        suggestions.push('您还没有开始学习，建议先进行一次考试了解自己的水平。');
    } else if (examCount < 3) {
        suggestions.push('您已经开始了学习，建议再完成几次考试来建立学习习惯。');
    }
    
    // 找出需要重点复习的知识点

    const weakPoints = Object.entries(mastery)
        .filter(([kp, rate]) => parseFloat(rate) < 70)
        .sort(([kp1, rate1], [kp2, rate2]) => parseFloat(rate1) - parseFloat(rate2));
    
    if (weakPoints.length > 0) {
        const topWeakPoint = weakPoints[0];
        suggestions.push(`建议重点复习<strong>${getKnowledgePointName(topWeakPoint[0])}</strong>，当前掌握程度 ${topWeakPoint[1]}%。`);
    }
    
    // 根据练习频率给出建议

    const today = new Date().toDateString();
    const lastPracticeDate = ReportState.stats.lastPracticeDate;
    
    if (lastPracticeDate !== today) {
        suggestions.push('今天还没有练习，建议每天保持一定的练习量。');
    }
    
    // 根据总练习量给出建议

    const totalQuestions = ReportState.stats.totalQuestions || 0;
    if (totalQuestions < 50) {
        suggestions.push('练习量还可以增加，建议每天完成10-20道题目。');
    }
    
    // 如果没有建议，显示鼓励话语

    if (suggestions.length === 0) {
        suggestions.push('您的学习状态很好，继续保持！');
    }
    
    suggestionsDiv.innerHTML = suggestions.map(s => `<p>${s}</p>`).join('');
}

// 更新错题列表

function updateWrongQuestionsList() {
    const wrongQuestionsList = document.getElementById('wrongQuestionsList');
    if (!wrongQuestionsList) return;
    
    if (ReportState.wrongQuestions.length === 0) {
        wrongQuestionsList.innerHTML = `
            <div class="no-wrong-questions">
                <i class="fas fa-check-circle"></i>
                <p>太棒了！您目前没有错题需要复习。</p>
                <p>继续保持良好的学习状态！</p>
            </div>
        `;
        return;
    }
    
    // 显示最近5道错题

    const recentWrong = ReportState.wrongQuestions.slice(-5);
    
    wrongQuestionsList.innerHTML = recentWrong.map((question, index) => `
        <div class="wrong-question-item">
            <div class="wrong-question-header">
                <h4>错题 ${index + 1}</h4>
                <span class="wrong-date">${new Date(question.examDate).toLocaleDateString()}</span>
            </div>
            <div class="wrong-question-content">
                <p><strong>题目：</strong>${question.content}</p>
                <p><strong>您的答案：</strong>${question.userAnswer || '未答'}</p>
                <p><strong>正确答案：</strong>${question.correctAnswer}</p>
                <p><strong>解析：</strong>${question.explanation}</p>
            </div>
            <button class="btn btn-sm btn-outline" onclick="reviewWrongQuestion(${question.id})">
                <i class="fas fa-book-open"></i> 复习此题
            </button>
        </div>
    `).join('');
}

// 复习所有错题

function reviewAllWrongQuestions() {
    if (ReportState.wrongQuestions.length === 0) {
        alert('目前没有错题需要复习。');
        return;
    }
    
    alert(`开始复习错题，共有 ${ReportState.wrongQuestions.length} 道错题需要复习。`);
    // 这里应该跳转到错题复习页面

    console.log('开始复习错题...');
}

// 复习指定错题

function reviewWrongQuestion(questionId) {
    // 找到题目

    const question = ReportState.wrongQuestions.find(q => q.id === questionId);
    if (!question) {
        alert('题目未找到。');
        return;
    }
    
    // 显示题目详情

    const reviewHTML = `
        <div class="question-review">
            <h3>题目复习</h3>
            <div class="review-question">
                <p><strong>原题：</strong>${question.content}</p>
                <p><strong>您的答案：</strong>${question.userAnswer || '未答'}</p>
                <p><strong>正确答案：</strong>${question.correctAnswer}</p>
                <p><strong>详细解析：</strong>${question.explanation}</p>
                <p><strong>知识点：</strong>${question.knowledgePoints.map(kp => getKnowledgePointName(kp)).join('，')}</p>
            </div>
        </div>
    `;
    
    // 这里应该显示一个模态框或跳转到复习页面

    alert(`复习题目：${question.content}\n\n正确答案：${question.correctAnswer}\n\n解析：${question.explanation}`);
}

// 获取知识点名称

function getKnowledgePointName(kpCode) {
    const knowledgeMap = {
        'number_comparison': '数的大小比较',
        'three_digit': '三位数认识',
        'number_combination': '数字组合',
        'place_value': '位值认识',
        'division': '除法运算',
        'equal_sharing': '平均分配',
        'perimeter': '周长计算',
        'rectangle': '长方形认识',
        'symmetry': '对称图形',
        'geometric_shapes': '几何图形',
        'mixed_operations': '混合运算',
        'multiplication': '乘法运算',
        'area': '面积计算',
        'square': '正方形认识',
        'time': '时间认识',
        'clock': '钟表认识',
        'time_calculation': '时间计算',
        'addition': '加法运算'
    };
    
    return knowledgeMap[kpCode] || kpCode;
}

// 导出到全局

window.reviewAllWrongQuestions = reviewAllWrongQuestions;
window.reviewWrongQuestion = reviewWrongQuestion;