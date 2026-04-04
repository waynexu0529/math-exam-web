// 汽车零件收集系统 - 豪华赛车版

// 引入豪华赛车数据（如果已加载）
function getLuxuryCarForReward() {
    // 如果已经加载了豪华赛车数据，随机选一辆
    if (typeof LuxuryCars !== 'undefined' && LuxuryCars.getRandomCar) {
        return LuxuryCars.getRandomCar();
    }
    // 否则返回默认车辆
    return {
        id: 'default_car',
        name: '学习赛车',
        brand: '七喜数学',
        icon: '🚗',
        color: '#1E90FF',
        description: '通过学习获得的赛车'
    };
}

// 车库系统
const GarageSystem = {
    // 用户拥有的车辆
    ownedCars: [
        {
            id: 'sedan',
            name: '经典轿车',
            unlocked: true,
            perfectCount: 0,
            icon: '🚗'
        }
    ],
    
    // 可解锁车辆（豪华版）
    allCars: [
        { id: 'sedan', name: '学习入门车', unlocked: true, icon: '🚗', requiredPerfect: 0 },
        { id: 'sports', name: '数学跑车', unlocked: false, icon: '🏎️', requiredPerfect: 3 },
        { id: 'supercar', name: '知识超跑', unlocked: false, icon: '🏁', requiredPerfect: 6 },
        { id: 'hypercar', name: '学霸神车', unlocked: false, icon: '🚀', requiredPerfect: 9 },
        { id: 'f1', name: 'F1方程式', unlocked: false, icon: '👑', requiredPerfect: 12 }
    ],
    
    selectedCar: 'sedan',
    
    load() {
        const saved = localStorage.getItem('mathExamGarage');
        if (saved) {
            const data = JSON.parse(saved);
            this.ownedCars = data.ownedCars || this.ownedCars;
            this.selectedCar = data.selectedCar || 'sedan';
            
            this.allCars.forEach(car => {
                const owned = this.ownedCars.find(c => c.id === car.id);
                if (owned) {
                    car.unlocked = owned.unlocked;
                    car.perfectCount = owned.perfectCount || 0;
                }
            });
        }
    },
    
    save() {
        localStorage.setItem('mathExamGarage', JSON.stringify({
            ownedCars: this.ownedCars,
            selectedCar: this.selectedCar
        }));
    },
    
    checkUnlock(totalPerfectCount) {
        let newUnlock = null;
        
        this.allCars.forEach(car => {
            if (!car.unlocked && totalPerfectCount >= car.requiredPerfect) {
                car.unlocked = true;
                const ownedCar = {
                    id: car.id,
                    name: car.name,
                    unlocked: true,
                    perfectCount: totalPerfectCount,
                    icon: car.icon
                };
                this.ownedCars.push(ownedCar);
                newUnlock = car;
            }
        });
        
        return newUnlock;
    }
};

// 零件系统
const PartsSystem = {
    partsList: [
        { id: 1, name: '引擎', icon: '⚙️', position: 'center', questionIndex: 0 },
        { id: 2, name: '方向盘', icon: '🎯', position: 'front', questionIndex: 1 },
        { id: 3, name: '前轮左', icon: '🛞', position: 'front-left', questionIndex: 2 },
        { id: 4, name: '前轮右', icon: '🛞', position: 'front-right', questionIndex: 3 },
        { id: 5, name: '后轮左', icon: '🛞', position: 'rear-left', questionIndex: 4 },
        { id: 6, name: '后轮右', icon: '🛞', position: 'rear-right', questionIndex: 5 },
        { id: 7, name: '前车灯', icon: '💡', position: 'front', questionIndex: 6 },
        { id: 8, name: '尾灯', icon: '💡', position: 'rear', questionIndex: 7 },
        { id: 9, name: '保险杠', icon: '🛡️', position: 'front', questionIndex: 8 },
        { id: 10, name: '底盘', icon: '📐', position: 'bottom', questionIndex: 9 }
    ],
    
    currentParts: [],
    
    init(totalQuestions) {
        this.currentParts = new Array(totalQuestions).fill(null).map((_, index) => ({
            partId: index + 1,
            name: this.partsList[index]?.name || `零件${index + 1}`,
            icon: this.partsList[index]?.icon || '🔧',
            position: this.partsList[index]?.position || 'center',
            status: 'missing',
            questionIndex: index
        }));
    },
    
    collectPart(questionIndex, isCorrect) {
        if (this.currentParts[questionIndex]) {
            this.currentParts[questionIndex].status = isCorrect ? 'good' : 'damaged';
        }
    },
    
    getProgress() {
        const total = this.currentParts.length;
        const collected = this.currentParts.filter(p => p.status !== 'missing').length;
        const good = this.currentParts.filter(p => p.status === 'good').length;
        const damaged = this.currentParts.filter(p => p.status === 'damaged').length;
        
        return { total, collected, good, damaged };
    },
    
    canPassCrashTest() {
        return this.currentParts.every(p => p.status === 'good');
    },
    
    repairPart(questionIndex) {
        if (this.currentParts[questionIndex]) {
            this.currentParts[questionIndex].status = 'good';
        }
    }
};

// 碰撞测试系统 - 豪华赛车版
const CrashTestSystem = {
    // 计算碰撞测试评分
    calculateRating(parts) {
        const progress = PartsSystem.getProgress();
        const score = (progress.good / progress.total) * 100;
        
        if (score === 100) return { stars: 5, grade: 'S', title: '完美通过！', color: '#ffd700', description: '零件全部完好，可以驾驶豪华赛车！' };
        if (score >= 80) return { stars: 4, grade: 'A', title: '优秀表现', color: '#ff6b6b', description: '大部分零件完好，赛车性能优秀！' };
        if (score >= 60) return { stars: 3, grade: 'B', title: '良好通过', color: '#4ecdc4', description: '零件基本完好，可以正常驾驶。' };
        if (score >= 40) return { stars: 2, grade: 'C', title: '勉强通过', color: '#95a5a6', description: '部分零件损坏，建议修复后使用。' };
        return { stars: 1, grade: 'D', title: '需要改进', color: '#e74c3c', description: '零件损坏严重，需要重新学习！' };
    },
    
    // 生成碰撞报告 - 带豪华赛车展示
    generateReport() {
        const progress = PartsSystem.getProgress();
        const rating = this.calculateRating(PartsSystem.currentParts);
        const rewardCar = getLuxuryCarForReward();
        
        return {
            rating,
            progress,
            rewardCar, // 奖励的豪华赛车
            damagedParts: PartsSystem.currentParts.filter(p => p.status === 'damaged'),
            canDrive: PartsSystem.canPassCrashTest()
        };
    },
    
    // 生成豪华赛车展示HTML
    generateLuxuryCarDisplay(report) {
        const car = report.rewardCar;
        const rating = report.rating;
        
        return `
            <div class="luxury-car-reward" style="
                background: linear-gradient(135deg, ${rating.color}22 0%, ${rating.color}44 100%);
                border: 3px solid ${rating.color};
                border-radius: 16px;
                padding: 30px;
                margin: 20px 0;
                text-align: center;
                animation: carReveal 1s ease-out;
            ">
                <div style="font-size: 5em; margin-bottom: 20px; animation: carBounce 2s ease-in-out infinite;">
                    ${car.icon}
                </div>
                <h2 style="color: ${rating.color}; margin: 10px 0;">
                    ${rating.title}
                </h2>
                <div style="
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #333;
                    margin: 15px 0;
                ">
                    ${car.name}
                </div>
                ${car.brand ? `<div style="color: #666; margin: 10px 0;">${car.brand}</div>` : ''}
                ${car.description ? `<div style="color: #888; font-style: italic; margin: 10px 0;">${car.description}</div>` : ''}
                <div style="
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 20px;
                    font-size: 1.2em;
                ">
                    <div>
                        <div style="color: #28a745; font-weight: bold;">✓ ${report.progress.good}</div>
                        <div style="color: #666; font-size: 0.9em;">完好零件</div>
                    </div>
                    <div>
                        <div style="color: #dc3545; font-weight: bold;">✗ ${report.progress.damaged}</div>
                        <div style="color: #666; font-size: 0.9em;">损坏零件</div>
                    </div>
                </div>
                <div style="
                    margin-top: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    color: #555;
                ">
                    ${rating.description}
                </div>
            </div>
            
            <style>
                @keyframes carReveal {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes carBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            </style>
        `;
    }
};

// 导出到全局
window.GarageSystem = GarageSystem;
window.PartsSystem = PartsSystem;
window.CrashTestSystem = CrashTestSystem;
window.getLuxuryCarForReward = getLuxuryCarForReward;

// 初始化加载
document.addEventListener('DOMContentLoaded', function() {
    GarageSystem.load();
});
