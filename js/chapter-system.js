// 章节管理系统

const ChapterSystem = {
    // 北师大版三年级数学章节
    chapters: [
        { id: 'ch1', name: '第一章：混合运算', icon: '🔢' },
        { id: 'ch2', name: '第二章：观察物体', icon: '👀' },
        { id: 'ch3', name: '第三章：加与减', icon: '➕➖' },
        { id: 'ch4', name: '第四章：乘与除', icon: '✖️➗' },
        { id: 'ch5', name: '第五章：周长', icon: '📐' },
        { id: 'ch6', name: '第六章：乘法', icon: '✖️' },
        { id: 'ch7', name: '第七章：年、月、日', icon: '📅' },
        { id: 'ch8', name: '第八章：认识小数', icon: '🔢' },
        { id: 'ch9', name: '第九章：数据的整理和表示', icon: '📊' },
        { id: 'ch10', name: '第十章：认识分数', icon: '🍰' }
    ],
    
    // 获取章节名称
    getChapterName(chapterId) {
        const chapter = this.chapters.find(ch => ch.id === chapterId);
        return chapter ? chapter.name : '未知章节';
    },
    
    // 根据章节获取题目
    getQuestionsByChapters(allQuestions, chapterIds) {
        if (!chapterIds || chapterIds.length === 0) {
            return allQuestions;
        }
        
        return allQuestions.filter(q => {
            return q.chapters && q.chapters.some(ch => chapterIds.includes(ch));
        });
    }
};

// 导出到全局
window.ChapterSystem = ChapterSystem;
