// 知识点中英文映射
const KnowledgePointsMap = {
    // 基础运算
    'addition': '加法',
    'subtraction': '减法',
    'multiplication': '乘法',
    'division': '除法',
    'mixed_operations': '混合运算',
    
    // 数的认识
    'number_comparison': '数的大小比较',
    'number_combination': '数的组成',
    'number_sense': '数感',
    'place_value': '位值',
    'three_digit': '三位数',
    'estimation': '估算',
    
    // 计算表
    'multiplication_table': '乘法口诀',
    'division_table': '除法口诀',
    
    // 应用
    'word_problems': '应用题',
    'equal_sharing': '平均分',
    'equal_distribution': '等分',
    'equal_parts': '等份',
    'grouping': '分组',
    
    // 几何
    'geometric_shapes': '几何图形',
    'symmetry': '轴对称',
    'shapes': '图形',
    'polygon': '多边形',
    'angles': '角',
    'geometry': '几何',
    
    // 测量
    'perimeter': '周长',
    'area': '面积',
    'rectangle': '长方形',
    'square': '正方形',
    
    // 时间
    'time': '时间',
    'clock': '时钟',
    'time_calculation': '时间计算',
    
    // 分数
    'fractions': '分数',
    'comparison': '比较',
    
    // 策略
    'strategies': '计算策略'
};

// 翻译知识点
function translateKnowledgePoint(point) {
    return KnowledgePointsMap[point] || point;
}

// 导出到全局
window.translateKnowledgePoint = translateKnowledgePoint;
