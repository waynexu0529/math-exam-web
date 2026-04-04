// 七喜数学辅导课 - 汽车闯关游戏系统
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏
    initGame();
});

// 游戏状态管理
const GameState = {
    user: null,
    selectedCar: null,
    cars: [],
    parts: {},
    chapters: [],
    currentChapter: 0,
    gameData: {
        totalExams: 0,
        totalCorrect: 0,
        totalTime: 0,
        bestScore: 0,
        carCollection: [],
        unlockedParts: []
    }
};

// 初始化游戏
function initGame() {
    // 检查用户登录状态
    const savedUser = localStorage.getItem('mathExamUser');
    if (!savedUser) {
        alert('请先登录！');
        window.location.href = 'index.html';
        return;
    }
    
    // 加载用户信息
    GameState.user = JSON.parse(savedUser);
    
    // 加载游戏数据
    loadGameData();
    
    // 初始化车库
    initGarage();
    
    // 初始化章节
    initChapters();
    
    // 绑定事件
    bindGameEvents();
    
    // 更新UI
    updateGameUI();
    
    console.log('游戏初始化完成');
}

// 加载游戏数据
function loadGameData() {
    // 加载游戏数据
    const savedGameData = localStorage.getItem('mathExamGameData');
    if (savedGameData) {
        GameState.gameData = JSON.parse(savedGameData);
    }
    
    // 初始化基础汽车
    initBaseCars();
    
    // 初始化零件系统

    initPartsSystem();
}

// 初始化基础汽车
function initBaseCars() {
    GameState.cars = [
        {
            id: 'car_001',
            name: '数学小跑车',
            type: 'sports',
            attributes: {
                speed: 60,
                handling: 50,
                durability: 40,
                acceleration: 55,
                braking: 45
            },
            parts: {
                engine: { level: 1, type: 'basic' },
                tires: { level: 1, type: 'basic' },
                brakes: { level: 1, type: 'basic' },
                suspension: { level: 1, type: 'basic' }
            },
            unlocked: true,
            selected: true
        },
        {
            id: 'car_002',
            name: '学霸赛车',
            type: 'race',
            attributes: {
                speed: 70,
                handling: 60,
                durability: 50,
                acceleration: 65,
                braking: 55
            },
            parts: {},
            unlocked: false,
            selected: false
        },
        {
            id: 'car_003',
            name: '方程式学习车',
            type: 'formula',
            attributes: {
                speed: 80,
                handling: 70,
                durability: 60,
                acceleration: 75,
                braking: 65
            },
            parts: {},
            unlocked: false,
            selected: false
        }
    ];
    
    // 设置当前选中的汽车

    GameState.selectedCar = GameState.cars.find(car => car.selected);
}

// 初始化零件系统

function initPartsSystem() {
    GameState.parts = {
        engines: [
            { id: 'engine_basic', name: '基础引擎', level: 1, speed: 10, acceleration: 15 },
            { id: 'engine_standard', name: '标准引擎', level: 2, speed: 20, acceleration: 25 },
            { id: 'engine_sports', name: '运动引擎', level: 3, speed: 30, acceleration: 35 },
            { id: 'engine_race', name: '赛车引擎', level:4, speed:40,acceleration:45 },
            { id: 'engine_epic', name: '史诗引擎', level:5, speed:50,acceleration:55 }
        ],
        tires: [
            { id: 'tires_basic', name: '基础轮胎', level: 1, handling:10,braking:15 },
            { id: 'tires_standard', name: '标准轮胎', level: 2, handling:20,braking:25 },
            { id: 'tires_sports', name: '运动轮胎', level: 3, handling:30,braking:35 },
            { id: 'tires_race', name: '赛车轮胎', level:4, handling:40,braking:45 },
            { id: 'tires_epic', name: '史诗轮胎', level:5, handling:50,braking:55 }
        ],
        brakes: [
            { id: 'brakes_basic', name: '基础刹车', level: 1, braking:20,safety:10 },
            { id: 'brakes_standard', name: '标准刹车', level: 2, braking:30,safety:20 },
            { id: 'brakes_sports', name: '运动刹车', level: 3, braking:40,safety:30 },
            { id: 'brakes_race', name: '赛车刹车', level:4, braking:50,safety:40 },
            { id: 'brakes_epic', name: '史诗刹车', level:5, braking:60,safety:50 }
        ],
        suspensions: [
            { id: 'suspension_basic', name: '基础悬挂', level: 1, handling:10,comfort:5 },
            { id: 'suspension_standard', name: '标准悬挂', level: 2, handling:20,comfort:10 },
            { id: 'suspension_sports', name: '运动悬挂', level: 3, handling:30,comfort:15 },
            { id: 'suspension_race', name: '赛车悬挂', level:4, handling:40,comfort:20 },
            { id: 'suspension_epic', name: '史诗悬挂', level:5, handling:50,comfort:25 }
        ]
    };
}

// 初始化章节

function initChapters() {
    GameState.chapters = [
        {
            id: 1,
            name: '加法运算',
            description: '学习基础的加法运算',
            requiredScore: 60,
            reward: 'engine_basic',
            unlocked: true,
            completed: false
        },
        {
            id: 2,
            name: '减法运算',
            description: '学习基础的减法运算',
            requiredScore: 70,
            reward: 'tires_basic',
            unlocked: false,
            completed: false
        },
        {
            id: 3,
name:'乘法运算',
description:'学习基础的乘法运算',
requiredScore: 80,
reward: 'brakes_basic',
unlocked: false,
completed: false
},
{
id: 4,
name: '除法运算',
description: '学习基础的除法运算',
requiredScore: 85,
reward: 'suspension_basic',
unlocked: false,
completed: false
},
{
id: 5,
name: '混合运算',
description: '学习混合运算',
requiredScore: 90,
reward: 'car_paint_race',
unlocked: false,
completed: false
}
];
}

// 初始化车库
function initGarage() {
    // 初始化车库数据
    const savedGarage = localStorage.getItem('mathExamGarage');
    if (savedGarage) {
        const garageData = JSON.parse(savedGarage);
        GameState.cars = garageData.cars || GameState.cars;
        GameState.selectedCar = garageData.selectedCar || GameState.selectedCar;
    }
}

// 绑定游戏事件

function bindGameEvents() {
    // 汽车选择事件
    bindCarSelectionEvents();
    
    // 章节导航事件
    bindChapterEvents();
    
    // 改装事件
    bindUpgradeEvents();
    
    // 比赛和碰撞测试事件
    bindRaceAndTestEvents();
}

// 绑定比赛和测试事件
function bindRaceAndTestEvents() {
    // 比赛按钮
    const startRaceBtn = document.getElementById('startRaceBtn');
    if (startRaceBtn) {
        startRaceBtn.addEventListener('click', startRace);
    }
    
    // 碰撞测试按钮 - 使用增强版
    const startCollisionTestBtn = document.getElementById('startCollisionTestBtn');
    if (startCollisionTestBtn) {
        startCollisionTestBtn.addEventListener('click', startEnhancedCollisionTest);
    }
}

// 开始碰撞测试
function startCollisionTest() {
    if (!GameState.selectedCar) {
        alert('请先选择一辆汽车！');
        return;
    }
    
    // 计算碰撞测试结果
    const collisionResult = calculateCollisionResult();
    
    // 显示碰撞测试结果
    showCollisionResult(collisionResult);
    
    // 保存游戏数据
    saveGameData();
}

// 计算碰撞测试结果
function calculateCollisionResult() {
    const car = GameState.selectedCar;
    
    // 基础耐久度
    let durability = car.attributes.durability;
    
    // 零件加成
    if (car.parts.brakes) {
        durability += car.parts.brakes.safety * 2;
    }
    
    if (car.parts.suspension) {
        durability += car.parts.suspension.comfort * 1.5;
    }
    
    // 随机因素
    const randomFactor = 0.7 + Math.random() * 0.6;
    const finalDurability = Math.round(durability * randomFactor);
    
    // 评估安全等级
    let safetyLevel = '基础';
    if (finalDurability > 80) safetyLevel = '优秀';
    else if (finalDurability > 60) safetyLevel = '良好';
    else if (finalDurability > 40) safetyLevel = '一般';
    else safetyLevel = '需要改进';
    
    return {
        durability: finalDurability,
        safetyLevel: safetyLevel,
        carName: car.name,
        parts: car.parts,
        timestamp: new Date().toISOString()
    };
}

// 显示碰撞测试结果
function showCollisionResult(result) {
    const collisionResult = document.getElementById('collisionResult');
    if (collisionResult) {
        const resultHTML = `
            <div class="collision-test-result">
                <h4>碰撞测试结果</h4>
                <div class="result-details">
                    <p>汽车: ${result.carName}</p>
                    <p>耐久度: ${result.durability}/100</p>
                    <p>安全等级: ${result.safetyLevel}</p>
                    <p>测试时间: ${new Date(result.timestamp).toLocaleString()}</p>
                </div>
                <div class="safety-advice">
                    <p>${getSafetyAdvice(result.safetyLevel)}</p>
                </div>
            </div>
        `;
        collisionResult.innerHTML = resultHTML;
    }
}

// 获取安全建议
function getSafetyAdvice(safetyLevel) {
    const advice = {
        '优秀': '✅ 您的赛车安全性能非常优秀！可以安全参加比赛。',
        '良好': '✅ 安全性能良好，建议继续升级刹车和悬挂系统。',
        '一般': '⚠️ 安全性能一般，强烈建议升级安全相关零件。',
        '基础': '❌ 安全性能需要改进，请先升级刹车系统。',
        '需要改进': '❌ 安全性能较差，建议全面升级安全零件。'
    };
    return advice[safetyLevel] || '请进行安全升级。';
}

// 绑定汽车选择事件
function bindCarSelectionEvents() {
    // 汽车选择按钮
    const carSelectButtons = document.querySelectorAll('.car-select-btn');
    carSelectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const carId = this.getAttribute('data-car-id');
            selectCar(carId);
        });
    });
}

// 选择汽车
function selectCar(carId) {
    // 取消之前的选择

    GameState.cars.forEach(car => {
        car.selected = false;
    });
    
    // 选择新汽车

    const selectedCar = GameState.cars.find(car => car.id === carId);
    if (selectedCar && selectedCar.unlocked) {
        selectedCar.selected = true;
        GameState.selectedCar = selectedCar;
        
        // 保存游戏数据

        saveGameData();
        
        // 更新UI

        updateGameUI();
        
        console.log('已选择汽车:', selectedCar.name);
    }
}

// 绑定章节事件
function bindChapterEvents() {
    // 章节开始按钮
    const startChapterButtons = document.querySelectorAll('.start-chapter-btn');
    startChapterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterId = parseInt(this.getAttribute('data-chapter-id'));
            startChapter(chapterId);
        });
    });
}

// 开始章节

function startChapter(chapterId) {
    const chapter = GameState.chapters.find(c => c.id === chapterId);
    if (!chapter || !chapter.unlocked) {
        alert('该章节尚未解锁！');
        return;
    }
    
    // 设置当前章节

    GameState.currentChapter = chapterId;
    
    // 跳转到考试页面
    window.location.href = 'exam.html?chapter=' + chapterId;
}

// 绑定比赛事件

function startRace() {
    if (!GameState.selectedCar) {
        alert('请先选择一辆汽车！');
        return;
    }
    
    // 计算比赛成绩

    const raceResult = calculateRaceResult();
    
    // 显示比赛结果

    showRaceResult(raceResult);
    
    // 保存游戏数据

    saveGameData();
}

// 计算比赛成绩
function calculateRaceResult() {
    const car = GameState.selectedCar;
    
    // 基础速度
    let speed = car.attributes.speed;
    
    // 引擎加成
    const engine = car.parts.engine;
    if (engine) {
        speed += engine.speed;
    }
    
    // 轮胎加成
    const tires = car.parts.tires;
    if (tires) {
        speed += tires.handling * 0.5; // 操控影响速度
    }
    
    // 悬挂加成
    const suspension = car.parts.suspension;
    if (suspension) {
        speed += suspension.handling * 0.3;
    }
    
    // 随机因素
    const randomFactor = 0.8 + Math.random() * 0.4;
    const finalSpeed = Math.round(speed * randomFactor);
    
    return {
        speed: finalSpeed,
        time: Math.round(10000 / finalSpeed), // 10000米距离
        score: Math.round(finalSpeed * 10),
        carName: car.name,
        carType: car.type,
        parts: car.parts
    };
}

// 显示比赛结果

function showRaceResult(result) {
    const resultHTML = `
        <div class="race-result">
            <h2>🏁 比赛完成！</h2>
            <div class="result-details">
                <div class="result-card">
                    <h3>${result.carName}</h3>
                    <p>速度: ${result.speed} km/h</p>
                    <p>用时: ${result.time} 秒</p>
                    <p>得分: ${result.score} 分</p>
                </div>
                <div class="result-stats">
                    <h4>汽车状态</h4>
                    <p>引擎: ${result.parts.engine ? result.parts.engine.type : '基础'}</p>
                    <p>轮胎: ${result.parts.tires ? result.parts.tires.type : '基础'}</p>
                    <p>刹车: ${result.parts.brakes ? result.parts.brakes.type : '基础'}</p>
                </div>
            </div>
        </div>
    `;
    
    // 这里应该将结果插入到页面中
    console.log('比赛结果:', result);
}

// 绑定改装事件
function bindUpgradeEvents() {
    // 零件升级按钮
    const upgradeButtons = document.querySelectorAll('.upgrade-part-btn');
    upgradeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const partId = this.getAttribute('data-part-id');
            upgradeCarPart(partId);
        });
    });
}

// 升级汽车零件

function upgradeCarPart(partId) {
    const car = GameState.selectedCar;
    if (!car) {
        alert('请先选择一辆汽车！');
        return;
    }
    
    // 检查是否有足够的积分

    const part = GameState.parts[partId];
    if (!part) {
        alert('零件不存在！');
        return;
    }
    
    const upgradeCost = calculateUpgradeCost(part.level);
    const currentPoints = GameState.gameData.totalCorrect * 10;
    
    if (currentPoints >= upgradeCost) {
        // 升级零件

        part.level++;
        car.attributes[part.affects[0]] += part[part.affects[0]];
        if (part.affects[1]) {
            car.attributes[part.affects[1]] += part[part.affects[1]];
        }
        
        // 扣除积分

        GameState.gameData.totalCorrect -= Math.floor(upgradeCost / 10);
        
        // 保存游戏数据

        saveGameData();
        
        // 更新UI

        updateGameUI();
        
        console.log('零件升级成功:', partId, '新等级:', part.level);
    } else {
        alert(`积分不足！需要 ${upgradeCost} 积分，当前有 ${currentPoints} 积分`);
    }
}

// 计算升级成本

function calculateUpgradeCost(level) {
    const baseCost = 100;
    const multiplier = 1.5;
    return Math.round(baseCost * Math.pow(multiplier, level - 1));
}

// 更新游戏UI
function updateGameUI() {
    // 更新汽车选择状态
    updateCarSelectionUI();
    
    // 更新章节状态
    updateChapterUI();
    
    // 更新比赛结果
    updateRaceResultUI();
}

// 更新汽车选择UI

function updateCarSelectionUI() {
    const carSelectionContainer = document.getElementById('carSelectionContainer');
    if (carSelectionContainer) {
        let html = '<h3>选择你的赛车</h3><div class="car-list">';
        
        GameState.cars.forEach(car => {
            const isSelected = car.selected ? 'selected' : '';
            const isUnlocked = car.unlocked ? '' : 'locked';
            
            html += `
                <div class="car-item ${isSelected} ${isUnlocked}" data-car-id="${car.id}">
                    <div class="car-icon">
                        <i class="fas fa-car"></i>
                    </div>
                    <div class="car-info">
                        <h4>${car.name}</h4>
                        <p>类型: ${car.type}</p>
                        <p>速度: ${car.attributes.speed}</p>
                        <p>操控: ${car.attributes.handling}</p>
                    </div>
                    <button class="btn btn-sm ${car.unlocked ? 'btn-primary' : 'btn-disabled'} car-select-btn" 
                            data-car-id="${car.id}"
                            ${car.unlocked ? '' : 'disabled'}>
                        ${car.selected ? '已选择' : (car.unlocked ? '选择' : '未解锁')}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        carSelectionContainer.innerHTML = html;
        
        // 重新绑定事件
        bindCarSelectionEvents();
    }
}

// 更新章节UI

function updateChapterUI() {
    const chapterContainer = document.getElementById('chapterContainer');
    if (chapterContainer) {
        let html = '<h3>数学章节</h3><div class="chapter-list">';
        
        GameState.chapters.forEach(chapter => {
            const isUnlocked = chapter.unlocked ? '' : 'locked';
            const isCompleted = chapter.completed ? 'completed' : '';
            
            html += `
                <div class="chapter-item ${isUnlocked} ${isCompleted}" data-chapter-id="${chapter.id}">
                    <div class="chapter-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="chapter-info">
                        <h4>第${chapter.id}章: ${chapter.name}</h4>
                        <p>${chapter.description}</p>
                        <p>要求分数: ${chapter.requiredScore}</p>
                        <p>奖励: ${chapter.reward}</p>
                    </div>
                    <button class="btn btn-sm ${chapter.unlocked ? 'btn-primary' : 'btn-disabled'} start-chapter-btn" 
                            data-chapter-id="${chapter.id}"
                            ${chapter.unlocked ? '' : 'disabled'}>
                        ${chapter.completed ? '已完成' : (chapter.unlocked ? '开始' : '未解锁')}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        chapterContainer.innerHTML = html;
        
        // 重新绑定事件
        bindChapterEvents();
    }
}

// 更新比赛结果UI

function updateRaceResultUI() {
    const raceResultContainer = document.getElementById('raceResultContainer');
    if (raceResultContainer) {
        // 显示最新的比赛结果

        const latestRace = GameState.gameData.latestRace;
        if (latestRace) {
            const resultHTML = `
                <div class="race-result-display">
                    <h3>最近比赛结果</h3>
                    <div class="result-details">
                        <p>汽车: ${latestRace.carName}</p>
                        <p>速度: ${latestRace.speed} km/h</p>
                        <p>用时: ${latestRace.time} 秒</p>
                        <p>得分: ${latestRace.score} 分</p>
                        <p>时间: ${new Date(latestRace.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            `;
            raceResultContainer.innerHTML = resultHTML;
        }
    }
}

// 保存游戏数据

function saveGameData() {
    // 保存游戏数据

    localStorage.setItem('mathExamGameData', JSON.stringify(GameState.gameData));
    
    // 保存车库数据

    const garageData = {
        cars: GameState.cars,
        selectedCar: GameState.selectedCar
    };
    localStorage.setItem('mathExamGarage', JSON.stringify(garageData));
}

// 保存章节进度

function saveChapterProgress(chapterId, score, reward) {
    const chapter = GameState.chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    chapter.completed = true;
    chapter.score = score;
    
    // 解锁奖励零件

    if (reward && !GameState.gameData.unlockedParts.includes(reward)) {
        GameState.gameData.unlockedParts.push(reward);
    }
    
    // 检查是否解锁下一章

    if (chapterId < GameState.chapters.length) {
        const nextChapter = GameState.chapters.find(c => c.id === chapterId + 1);
        if (nextChapter && score >= chapter.requiredScore) {
            nextChapter.unlocked = true;
        }
    }
    
    // 保存游戏数据

    saveGameData();
    
    // 更新UI

    updateGameUI();
}

// 导出到全局

window.GameState = GameState;
window.mathExamGame = {
    initGame,
    selectCar,
    startChapter,
    startRace,
    upgradeCarPart,
    saveChapterProgress
};