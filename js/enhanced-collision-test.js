// 豪华赛车碰撞测试系统 - 增强版
// 新增功能：随机选择豪华赛车、真实碰撞动画、详细碰撞报告

// 豪华赛车数据库
const LuxuryCars = {
    cars: [
        {
            id: 'lamborghini_aventador',
            name: '兰博基尼 Aventador',
            brand: 'Lamborghini',
            baseSpeed: 350,
            baseSafety: 85,
            weight: 1575,
            icon: '🏎️',
            color: '#FFD700',
            description: '意大利超级跑车，拥有强大的V12引擎'
        },
        {
            id: 'lamborghini_huracan',
            name: '兰博基尼 Huracán',
            brand: 'Lamborghini',
            baseSpeed: 325,
            baseSafety: 83,
            weight: 1422,
            icon: '🏁',
            color: '#00CED1',
            description: '兰博基尼家族的入门超跑，依然强悍'
        },
        {
            id: 'ferrari_f8',
            name: '法拉利 F8 Tributo',
            brand: 'Ferrari',
            baseSpeed: 340,
            baseSafety: 87,
            weight: 1435,
            icon: '🏎️',
            color: '#DC143C',
            description: '法拉利的中置引擎杰作，优雅而凶猛'
        },
        {
            id: 'ferrari_sf90',
            name: '法拉利 SF90 Stradale',
            brand: 'Ferrari',
            baseSpeed: 340,
            baseSafety: 90,
            weight: 1570,
            icon: '🚀',
            color: '#FF4500',
            description: '法拉利首款插电混动超跑，科技与性能的结合'
        },
        {
            id: 'aston_martin_db11',
            name: '阿斯顿马丁 DB11',
            brand: 'Aston Martin',
            baseSpeed: 322,
            baseSafety: 88,
            weight: 1770,
            icon: '🚘',
            color: '#2F4F4F',
            description: '英伦优雅与暴力美学的完美结合'
        },
        {
            id: 'aston_martin_vantage',
            name: '阿斯顿马丁 Vantage',
            brand: 'Aston Martin',
            baseSpeed: 314,
            baseSafety: 86,
            weight: 1530,
            icon: '🚗',
            color: '#556B2F',
            description: '入门级阿斯顿马丁，依然豪华至极'
        },
        {
            id: 'porsche_911_turbo',
            name: '保时捷 911 Turbo S',
            brand: 'Porsche',
            baseSpeed: 330,
            baseSafety: 92,
            weight: 1640,
            icon: '🏎️',
            color: '#FFD700',
            description: '传奇跑车，每日可用的超级性能'
        },
        {
            id: 'porsche_918',
            name: '保时捷 918 Spyder',
            brand: 'Porsche',
            baseSpeed: 345,
            baseSafety: 91,
            weight: 1640,
            icon: '⚡',
            color: '#C0C0C0',
            description: '混动超跑三巨头之一，科技标杆'
        },
        {
            id: 'mclaren_720s',
            name: '迈凯伦 720S',
            brand: 'McLaren',
            baseSpeed: 341,
            baseSafety: 84,
            weight: 1283,
            icon: '🏁',
            color: '#FF6347',
            description: '英国超跑，轻量化与性能的极致追求'
        },
        {
            id: 'mclaren_p1',
            name: '迈凯伦 P1',
            brand: 'McLaren',
            baseSpeed: 350,
            baseSafety: 89,
            weight: 1490,
            icon: '🚀',
            color: '#FFD700',
            description: '混动超跑三巨头之一，赛道之王'
        },
        {
            id: 'bugatti_chiron',
            name: '布加迪 Chiron',
            brand: 'Bugatti',
            baseSpeed: 420,
            baseSafety: 95,
            weight: 1995,
            icon: '👑',
            color: '#000080',
            description: '速度之王，1500马力的艺术品'
        },
        {
            id: 'pagani_huayra',
            name: '帕加尼 Huayra',
            brand: 'Pagani',
            baseSpeed: 383,
            baseSafety: 86,
            weight: 1350,
            icon: '💎',
            color: '#4B0082',
            description: '意大利手工艺术，每辆都是艺术品'
        }
    ],
    
    // 随机选择一辆赛车
    getRandomCar() {
        const randomIndex = Math.floor(Math.random() * this.cars.length);
        return this.cars[randomIndex];
    },
    
    // 随机选择多辆赛车
    getRandomCars(count) {
        const shuffled = [...this.cars].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, this.cars.length));
    }
};

// 增强版碰撞测试函数
function startEnhancedCollisionTest() {
    if (!GameState.selectedCar) {
        alert('请先选择一辆汽车！');
        return;
    }
    
    // 随机选择3-5辆豪华赛车进行碰撞测试
    const participantCount = 3 + Math.floor(Math.random() * 3); // 3-5辆
    const participatingCars = LuxuryCars.getRandomCars(participantCount);
    
    // 将用户的赛车也加入
    const userCar = {
        id: GameState.selectedCar.id,
        name: GameState.selectedCar.name,
        brand: '七喜数学',
        baseSpeed: GameState.selectedCar.attributes.speed,
        baseSafety: GameState.selectedCar.attributes.durability,
        weight: 1200,
        icon: '🚗',
        color: '#1E90FF',
        description: '通过数学考试改装的赛车',
        isUserCar: true
    };
    
    // 计算碰撞结果
    const collisionResults = calculateEnhancedCollisionResults([userCar, ...participatingCars]);
    
    // 显示增强版碰撞测试结果
    showEnhancedCollisionResult(collisionResults);
    
    // 保存游戏数据
    saveGameData();
}

// 计算增强版碰撞结果
function calculateEnhancedCollisionResults(cars) {
    const results = [];
    
    cars.forEach(car => {
        // 基础安全分数
        let safetyScore = car.baseSafety;
        
        // 如果是用户的车，考虑零件加成
        if (car.isUserCar && GameState.selectedCar.parts) {
            const parts = GameState.selectedCar.parts;
            if (parts.brakes) {
                safetyScore += parts.brakes.level * 3;
            }
            if (parts.suspension) {
                safetyScore += parts.suspension.level * 2;
            }
        }
        
        // 碰撞速度因素（速度越高，碰撞越严重）
        const speedFactor = 1 - (car.baseSpeed / 500) * 0.2; // 速度惩罚
        
        // 重量因素（重量越大，越安全）
        const weightFactor = 1 + (car.weight / 2000) * 0.15; // 重量加成
        
        // 随机因素
        const randomFactor = 0.85 + Math.random() * 0.3;
        
        // 计算最终安全得分
        const finalSafetyScore = Math.min(100, Math.max(0, 
            Math.round(safetyScore * speedFactor * weightFactor * randomFactor)
        ));
        
        // 计算损伤程度
        const damagePercent = 100 - finalSafetyScore;
        let damageLevel = '';
        let safetyRating = '';
        
        if (finalSafetyScore >= 90) {
            damageLevel = '轻微损伤';
            safetyRating = '⭐⭐⭐⭐⭐ 优秀';
        } else if (finalSafetyScore >= 80) {
            damageLevel = '中等损伤';
            safetyRating = '⭐⭐⭐⭐ 良好';
        } else if (finalSafetyScore >= 70) {
            damageLevel = '较重损伤';
            safetyRating = '⭐⭐⭐ 一般';
        } else if (finalSafetyScore >= 60) {
            damageLevel = '严重损伤';
            safetyRating = '⭐⭐ 需改进';
        } else {
            damageLevel = '极度损伤';
            safetyRating = '⭐ 危险';
        }
        
        results.push({
            car: car,
            safetyScore: finalSafetyScore,
            damagePercent: damagePercent,
            damageLevel: damageLevel,
            safetyRating: safetyRating,
            speedFactor: speedFactor,
            weightFactor: weightFactor
        });
    });
    
    // 按安全得分排序
    results.sort((a, b) => b.safetyScore - a.safetyScore);
    
    return results;
}

// 显示增强版碰撞结果
function showEnhancedCollisionResult(results) {
    const collisionResult = document.getElementById('collisionResult');
    if (!collisionResult) return;
    
    // 构建结果HTML
    let resultHTML = `
        <div class="enhanced-collision-result">
            <div class="collision-header">
                <h3>💥 多车碰撞测试报告 💥</h3>
                <p class="test-info">测试时间: ${new Date().toLocaleString('zh-CN')}</p>
                <p class="test-desc">参与车辆: ${results.length}辆 | 测试标准: Euro NCAP 碰撞测试</p>
            </div>
            
            <div class="collision-animation">
                <div class="crash-effect">
                    ${results.map((result, index) => `
                        <div class="car-crash-icon" style="animation-delay: ${index * 0.2}s">
                            ${result.car.icon}
                        </div>
                    `).join('')}
                </div>
                <div class="impact-wave"></div>
            </div>
            
            <div class="collision-results-list">
                ${results.map((result, index) => {
                    const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
                    const userBadge = result.car.isUserCar ? '<span class="user-badge">你的赛车</span>' : '';
                    const safetyColor = result.safetyScore >= 80 ? '#4CAF50' : result.safetyScore >= 60 ? '#FF9800' : '#F44336';
                    
                    return `
                        <div class="collision-car-result ${result.car.isUserCar ? 'user-car-result' : ''}">
                            <div class="result-rank">${rankBadge}</div>
                            <div class="result-car-info">
                                <div class="car-icon" style="font-size: 3em;">${result.car.icon}</div>
                                <div class="car-details">
                                    <h4>${result.car.name} ${userBadge}</h4>
                                    <p class="car-brand">${result.car.brand}</p>
                                    <p class="car-desc">${result.car.description}</p>
                                </div>
                            </div>
                            <div class="result-metrics">
                                <div class="metric">
                                    <span class="metric-label">安全得分</span>
                                    <div class="metric-bar">
                                        <div class="metric-fill" style="width: ${result.safetyScore}%; background: ${safetyColor}"></div>
                                    </div>
                                    <span class="metric-value" style="color: ${safetyColor}">${result.safetyScore}/100</span>
                                </div>
                                <div class="metric-row">
                                    <div class="metric-item">
                                        <span class="label">损伤程度:</span>
                                        <span class="value">${result.damagePercent}% - ${result.damageLevel}</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="label">安全评级:</span>
                                        <span class="value">${result.safetyRating}</span>
                                    </div>
                                </div>
                                <div class="metric-row">
                                    <div class="metric-item">
                                        <span class="label">最高时速:</span>
                                        <span class="value">${result.car.baseSpeed} km/h</span>
                                    </div>
                                    <div class="metric-item">
                                        <span class="label">重量:</span>
                                        <span class="value">${result.car.weight} kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="collision-summary">
                <h4>📊 测试总结</h4>
                ${results.find(r => r.car.isUserCar) ? `
                    <div class="user-car-summary">
                        <p><strong>你的赛车排名:</strong> 第 ${results.findIndex(r => r.car.isUserCar) + 1} 名</p>
                        <p><strong>安全建议:</strong> ${getCollisionAdvice(results.find(r => r.car.isUserCar).safetyScore)}</p>
                    </div>
                ` : ''}
                <div class="test-conclusion">
                    <p>💡 提示：通过数学考试解锁更多零件，提升赛车安全性能！</p>
                    <p>🔧 建议优先升级刹车系统和悬挂系统来提高碰撞安全性。</p>
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="startEnhancedCollisionTest()">
                <i class="fas fa-redo"></i> 重新测试
            </button>
        </div>
    `;
    
    collisionResult.innerHTML = resultHTML;
    
    // 添加动画效果
    setTimeout(() => {
        const resultElement = collisionResult.querySelector('.enhanced-collision-result');
        if (resultElement) {
            resultElement.classList.add('show');
        }
    }, 100);
}

// 获取碰撞安全建议
function getCollisionAdvice(safetyScore) {
    if (safetyScore >= 90) {
        return '✅ 优秀！你的赛车安全性能非常出色，可以安全参加高速比赛。';
    } else if (safetyScore >= 80) {
        return '✅ 良好！安全性能不错，建议继续升级刹车和悬挂系统以达到最佳状态。';
    } else if (safetyScore >= 70) {
        return '⚠️ 一般。安全性能还有提升空间，强烈建议升级安全相关零件后再参加比赛。';
    } else if (safetyScore >= 60) {
        return '⚠️ 需要改进。安全性能较弱，请优先升级刹车系统和悬挂系统。';
    } else {
        return '❌ 危险！安全性能严重不足，必须全面升级安全零件才能参加比赛！';
    }
}

// 导出到全局
window.LuxuryCars = LuxuryCars;
window.startEnhancedCollisionTest = startEnhancedCollisionTest;
