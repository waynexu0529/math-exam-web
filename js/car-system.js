// 汽车零件收集系统

// 车库系统
const GarageSystem = {
    // 用户拥有的车辆
    ownedCars: [
        {
            id: 'sedan',
            name: '经典轿车',
            unlocked: true,
            perfectCount: 0, // 满分次数
            icon: '🚗'
        }
    ],
    
    // 可解锁车辆
    allCars: [
        { id: 'sedan', name: '经典轿车', unlocked: true, icon: '🚗', requiredPerfect: 0 },
        { id: 'suv', name: '越野SUV', unlocked: false, icon: '🚙', requiredPerfect: 3 },
        { id: 'sports', name: '运动跑车', unlocked: false, icon: '🏎️', requiredPerfect: 6 },
        { id: 'supercar', name: '超级跑车', unlocked: false, icon: '🏁', requiredPerfect: 9 },
        { id: 'f1', name: 'F1赛车', unlocked: false, icon: '🏎️', requiredPerfect: 12 }
    ],
    
    // 当前选择的车辆
    selectedCar: 'sedan',
    
    // 加载车库数据
    load() {
        const saved = localStorage.getItem('mathExamGarage');
        if (saved) {
            const data = JSON.parse(saved);
            this.ownedCars = data.ownedCars || this.ownedCars;
            this.selectedCar = data.selectedCar || 'sedan';
            
            // 更新allCars的解锁状态
            this.allCars.forEach(car => {
                const owned = this.ownedCars.find(c => c.id === car.id);
                if (owned) {
                    car.unlocked = owned.unlocked;
                    car.perfectCount = owned.perfectCount || 0;
                }
            });
        }
    },
    
    // 保存车库数据
    save() {
        localStorage.setItem('mathExamGarage', JSON.stringify({
            ownedCars: this.ownedCars,
            selectedCar: this.selectedCar
        }));
    },
    
    // 检查是否可以解锁新车
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
    // 零件定义
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
    
    // 当前考试收集的零件
    currentParts: [],
    
    // 初始化
    init(totalQuestions) {
        this.currentParts = new Array(totalQuestions).fill(null).map((_, index) => ({
            partId: index + 1,
            name: this.partsList[index]?.name || `零件${index + 1}`,
            icon: this.partsList[index]?.icon || '🔧',
            position: this.partsList[index]?.position || 'center',
            status: 'missing', // missing | good | damaged
            questionIndex: index
        }));
    },
    
    // 获得零件
    collectPart(questionIndex, isCorrect) {
        if (this.currentParts[questionIndex]) {
            this.currentParts[questionIndex].status = isCorrect ? 'good' : 'damaged';
        }
    },
    
    // 获取收集进度
    getProgress() {
        const total = this.currentParts.length;
        const collected = this.currentParts.filter(p => p.status !== 'missing').length;
        const good = this.currentParts.filter(p => p.status === 'good').length;
        const damaged = this.currentParts.filter(p => p.status === 'damaged').length;
        
        return { total, collected, good, damaged };
    },
    
    // 检查是否可以通过碰撞测试
    canPassCrashTest() {
        return this.currentParts.every(p => p.status === 'good');
    },
    
    // 修复零件（重做错题）
    repairPart(questionIndex) {
        if (this.currentParts[questionIndex]) {
            this.currentParts[questionIndex].status = 'good';
        }
    }
};

// 碰撞测试系统
const CrashTestSystem = {
    // 计算碰撞测试评分
    calculateRating(parts) {
        const progress = PartsSystem.getProgress();
        const score = (progress.good / progress.total) * 100;
        
        if (score === 100) return { stars: 5, grade: 'S', title: '完美通过！', color: '#ffd700' };
        if (score >= 80) return { stars: 4, grade: 'A', title: '优秀表现', color: '#ff6b6b' };
        if (score >= 60) return { stars: 3, grade: 'B', title: '良好通过', color: '#4ecdc4' };
        if (score >= 40) return { stars: 2, grade: 'C', title: '勉强通过', color: '#95a5a6' };
        return { stars: 1, grade: 'D', title: '需要改进', color: '#e74c3c' };
    },
    
    // 生成碰撞报告
    generateReport() {
        const progress = PartsSystem.getProgress();
        const rating = this.calculateRating(PartsSystem.currentParts);
        
        return {
            rating,
            progress,
            damagedParts: PartsSystem.currentParts.filter(p => p.status === 'damaged'),
            canDrive: PartsSystem.canPassCrashTest()
        };
    }
};

// 导出到全局
window.GarageSystem = GarageSystem;
window.PartsSystem = PartsSystem;
window.CrashTestSystem = CrashTestSystem;

// 初始化加载
document.addEventListener('DOMContentLoaded', function() {
    GarageSystem.load();
});
