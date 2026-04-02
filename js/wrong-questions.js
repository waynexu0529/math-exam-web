// 错题本管理系统

// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    loadWrongQuestions();
    loadChapterFilters();
    updateWrongStats();
});

// 加载错题
function loadWrongQuestions() {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    const listContainer = document.getElementById('wrongList');
    
    console.log('=== 错题本加载 ===');
    console.log('错题数量:', wrongQuestions.length);
    console.log('错题数据:', wrongQuestions);
    
    if (wrongQuestions.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>暂无错题</h3>
                <p>继续加油，保持全对！✨</p>
            </div>
        `;
        document.getElementById('practiceBtn').disabled = true;
        return;
    }
    
    // 应用筛选
    const filtered = filterQuestions(wrongQuestions);
    
    console.log('筛选后错题数量:', filtered.length);
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-filter"></i>
                <h3>没有符合条件的错题</h3>
                <p>试试其他筛选条件</p>
            </div>
        `;
        return;
    }
    
    // 渲染错题卡片
    listContainer.innerHTML = filtered.map((item, index) => {
        // 容错处理：兼容旧数据格式
        let question, chapterName, userAnswer, isResolved;
        
        if (item.question) {
            // 新格式：有question字段
            question = item.question;
            chapterName = item.chapterName || '未分类';
            userAnswer = item.userAnswer;
            isResolved = item.resolved || false;
        } else {
            // 旧格式：question字段直接展开在item上
            question = item;
            chapterName = '未分类';
            userAnswer = item.userAnswer;
            isResolved = false;
        }
        
        // 确保question有必要的字段
        if (!question.content || !question.options || !question.correctAnswer) {
            console.error('错题数据格式错误:', item);
            return '';
        }
        
        return `
            <div class="wrong-question-card" data-question-id="${item.id || index}">
                <div class="question-header-info">
                    <div class="question-number">
                        <i class="fas fa-question-circle"></i> 
                        错题 #${index + 1}
                    </div>
                    <div class="question-badges">
                        <span class="badge ${isResolved ? 'badge-resolved' : 'badge-unresolved'}">
                            ${isResolved ? '✅ 已掌握' : '❌ 待复习'}
                        </span>
                        <span class="badge badge-chapter">${chapterName}</span>
                    </div>
                </div>
                
                <div class="question-content-text">
                    ${question.content}
                </div>
                
                <div class="wrong-options">
                    ${question.options.map(option => {
                        const isUserAnswer = option.id === userAnswer;
                        const isCorrectAnswer = option.id === question.correctAnswer;
                        let className = 'wrong-option-item';
                        let mark = '';
                        
                        if (isUserAnswer && !isCorrectAnswer) {
                            className += ' user-answer';
                            mark = '<span class="option-mark">❌ 你的答案</span>';
                        } else if (isCorrectAnswer) {
                            className += ' correct-answer';
                            mark = '<span class="option-mark">✅ 正确答案</span>';
                        }
                        
                        return `
                            <div class="${className}">
                                <span class="option-letter">${option.id}.</span>
                                <span class="option-text">${option.text}</span>
                                ${mark}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="wrong-explanation">
                    <h4><i class="fas fa-lightbulb"></i> 答案解析</h4>
                    <p>${question.explanation || '暂无解析'}</p>
                </div>
                
                ${question.knowledgePoints && question.knowledgePoints.length > 0 ? `
                    <div class="wrong-tags">
                        <strong>知识点：</strong>
                        ${question.knowledgePoints.map(point => 
                            `<span class="knowledge-tag">${translateKnowledgePoint(point)}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                
                <div class="question-actions">
                    ${!isResolved ? `
                        <button class="btn btn-success btn-sm" onclick="markAsResolved('${item.id || index}')">
                            <i class="fas fa-check"></i> 标记为已掌握
                        </button>
                    ` : `
                        <button class="btn btn-outline btn-sm" onclick="markAsUnresolved('${item.id || index}')">
                            <i class="fas fa-undo"></i> 取消掌握
                        </button>
                    `}
                    <button class="btn btn-danger btn-outline btn-sm" onclick="deleteWrongQuestion('${item.id || index}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 筛选问题
function filterQuestions(questions) {
    const statusFilter = document.getElementById('statusFilter').value;
    const chapterFilter = document.getElementById('chapterFilter').value;
    
    return questions.filter(item => {
        // 状态筛选
        if (statusFilter === 'resolved' && !item.resolved) return false;
        if (statusFilter === 'unresolved' && item.resolved) return false;
        
        // 章节筛选
        if (chapterFilter !== 'all') {
            const questionChapters = item.question.chapters || [];
            if (!questionChapters.includes(chapterFilter)) return false;
        }
        
        return true;
    });
}

// 应用筛选
function filterWrongQuestions() {
    loadWrongQuestions();
}

// 加载章节筛选器
function loadChapterFilters() {
    const chapterFilter = document.getElementById('chapterFilter');
    const chapters = ChapterSystem.chapters;
    
    chapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = `${chapter.icon} ${chapter.name}`;
        chapterFilter.appendChild(option);
    });
}

// 更新统计数据
function updateWrongStats() {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    const total = wrongQuestions.length;
    const resolved = wrongQuestions.filter(q => q.resolved).length;
    const unresolved = total - resolved;
    const masteryRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    document.getElementById('totalWrong').textContent = total;
    document.getElementById('unresolvedWrong').textContent = unresolved;
    document.getElementById('resolvedWrong').textContent = resolved;
    document.getElementById('masteryRate').textContent = masteryRate + '%';
}

// 标记为已掌握
function markAsResolved(questionId) {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    const index = wrongQuestions.findIndex(q => q.id === questionId);
    
    if (index !== -1) {
        wrongQuestions[index].resolved = true;
        wrongQuestions[index].resolvedAt = new Date().toISOString();
        localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
        
        loadWrongQuestions();
        updateWrongStats();
        
        showToast('✅ 已标记为掌握！', 'success');
    }
}

// 取消掌握标记
function markAsUnresolved(questionId) {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    const index = wrongQuestions.findIndex(q => q.id === questionId);
    
    if (index !== -1) {
        wrongQuestions[index].resolved = false;
        delete wrongQuestions[index].resolvedAt;
        localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
        
        loadWrongQuestions();
        updateWrongStats();
        
        showToast('❌ 已取消掌握标记', 'info');
    }
}

// 删除错题
function deleteWrongQuestion(questionId) {
    if (!confirm('确定要删除这道错题吗？')) return;
    
    let wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    wrongQuestions = wrongQuestions.filter(q => q.id !== questionId);
    localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
    
    loadWrongQuestions();
    updateWrongStats();
    
    showToast('🗑️ 错题已删除', 'success');
}

// 清空错题本
function clearWrongQuestions() {
    if (!confirm('确定要清空所有错题吗？此操作不可恢复！')) return;
    
    localStorage.removeItem('wrongQuestions');
    loadWrongQuestions();
    updateWrongStats();
    
    showToast('🗑️ 错题本已清空', 'success');
}

// 开始错题练习
function practiceWrongQuestions() {
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
    const statusFilter = document.getElementById('statusFilter').value;
    
    // 筛选待练习的题目
    let practiceQuestions = wrongQuestions;
    if (statusFilter === 'unresolved') {
        practiceQuestions = wrongQuestions.filter(q => !q.resolved);
    }
    
    if (practiceQuestions.length === 0) {
        alert('没有可练习的错题！');
        return;
    }
    
    // 创建错题练习考试
    const examQuestions = practiceQuestions.map(item => item.question);
    
    // 保存到localStorage
    const practiceExam = {
        id: 'wrong_practice_' + Date.now(),
        startTime: new Date(),
        questions: examQuestions,
        currentQuestionIndex: 0,
        userAnswers: new Array(examQuestions.length).fill(null),
        score: 0,
        totalQuestions: examQuestions.length,
        isPractice: true,
        practiceType: 'wrong_questions'
    };
    
    localStorage.setItem('currentExam', JSON.stringify(practiceExam));
    
    // 跳转到考试页面
    window.location.href = 'exam.html';
}

// 返回首页
function goToHome() {
    window.location.href = 'index.html';
}

// Toast提示
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#51cf66' : type === 'error' ? '#ff6b6b' : '#667eea'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 导出到全局
window.filterWrongQuestions = filterWrongQuestions;
window.markAsResolved = markAsResolved;
window.markAsUnresolved = markAsUnresolved;
window.deleteWrongQuestion = deleteWrongQuestion;
window.clearWrongQuestions = clearWrongQuestions;
window.practiceWrongQuestions = practiceWrongQuestions;
window.goToHome = goToHome;
