// 三年级下册数学题库
// 第一单元：位置与方向
// 第二单元：除数是一位数的除法
// 第三单元：两位数乘两位数
// 第四单元：面积
// 第五单元：年、月、日
// 第六单元：小数的初步认识
// 第七单元：数学广角（搭配问题）

function getGrade3Semester2QuestionBank() {
    return [
        // 第一单元：位置与方向
        {
            id: 1,
            type: 'single_choice',
            content: '小明面向东方，他向右转90度后，面向哪个方向？',
            options: [
                { id: 'A', text: '东' },
                { id: 'B', text: '南' },
                { id: 'C', text: '西' },
                { id: 'D', text: '北' }
            ],
            correctAnswer: 'B',
            explanation: '面向东方，向右转90度后面向南方。东→南→西→北，顺时针方向。',
            knowledgePoints: ['direction', 'spatial_orientation'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 2,
            type: 'single_choice',
            content: '学校在家的东北方向800米处，那么家在学校的什么方向？',
            options: [
                { id: 'A', text: '东北方向' },
                { id: 'B', text: '西南方向' },
                { id: 'C', text: '东南方向' },
                { id: 'D', text: '西北方向' }
            ],
            correctAnswer: 'B',
            explanation: '学校在家的东北方向，那么家在学校的西南方向。方向是相对的，正好相反。',
            knowledgePoints: ['direction', 'relative_position'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        // 第二单元：除数是一位数的除法
        {
            id: 3,
            type: 'single_choice',
            content: '96 ÷ 3 = ?',
            options: [
                { id: 'A', text: '30' },
                { id: 'B', text: '32' },
                { id: 'C', text: '33' },
                { id: 'D', text: '36' }
            ],
            correctAnswer: 'B',
            explanation: '96 ÷ 3 = 32。可以这样想：90 ÷ 3 = 30，6 ÷ 3 = 2，30 + 2 = 32。',
            knowledgePoints: ['division', 'one_digit_divisor'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 4,
            type: 'single_choice',
            content: '240 ÷ 6 = ?',
            options: [
                { id: 'A', text: '30' },
                { id: 'B', text: '40' },
                { id: 'C', text: '50' },
                { id: 'D', text: '60' }
            ],
            correctAnswer: 'B',
            explanation: '240 ÷ 6 = 40。可以想24 ÷ 6 = 4，所以240 ÷ 6 = 40。',
            knowledgePoints: ['division', 'zero_in_quotient'],
            difficulty: 'medium',
            estimatedTime: 35
        },
        {
            id: 5,
            type: 'single_choice',
            content: '有256本书，平均分给8个班级，每个班级分到多少本？',
            options: [
                { id: 'A', text: '30本' },
                { id: 'B', text: '32本' },
                { id: 'C', text: '34本' },
                { id: 'D', text: '36本' }
            ],
            correctAnswer: 'B',
            explanation: '256 ÷ 8 = 32(本)。每个班级分到32本书。',
            knowledgePoints: ['division', 'word_problem'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        // 第三单元：两位数乘两位数
        {
            id: 6,
            type: 'single_choice',
            content: '23 × 12 = ?',
            options: [
                { id: 'A', text: '246' },
                { id: 'B', text: '256' },
                { id: 'C', text: '266' },
                { id: 'D', text: '276' }
            ],
            correctAnswer: 'D',
            explanation: '23 × 12 = 23 × 10 + 23 × 2 = 230 + 46 = 276。',
            knowledgePoints: ['multiplication', 'two_digit_multiply'],
            difficulty: 'medium',
            estimatedTime: 45
        },
        {
            id: 7,
            type: 'single_choice',
            content: '一本书有48页，小明每天看15页，3天一共能看多少页？',
            options: [
                { id: 'A', text: '35页' },
                { id: 'B', text: '40页' },
                { id: 'C', text: '45页' },
                { id: 'D', text: '50页' }
            ],
            correctAnswer: 'C',
            explanation: '15 × 3 = 45(页)。3天一共能看45页。',
            knowledgePoints: ['multiplication', 'word_problem'],
            difficulty: 'easy',
            estimatedTime: 35
        },
        {
            id: 8,
            type: 'single_choice',
            content: '35 × 40 = ?',
            options: [
                { id: 'A', text: '1200' },
                { id: 'B', text: '1300' },
                { id: 'C', text: '1400' },
                { id: 'D', text: '1500' }
            ],
            correctAnswer: 'C',
            explanation: '35 × 40 = 35 × 4 × 10 = 140 × 10 = 1400。',
            knowledgePoints: ['multiplication', 'ending_with_zero'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        // 第四单元：面积
        {
            id: 9,
            type: 'single_choice',
            content: '一个长方形的长是8厘米，宽是5厘米，它的面积是多少平方厘米？',
            options: [
                { id: 'A', text: '26平方厘米' },
                { id: 'B', text: '30平方厘米' },
                { id: 'C', text: '40平方厘米' },
                { id: 'D', text: '48平方厘米' }
            ],
            correctAnswer: 'C',
            explanation: '长方形面积 = 长 × 宽 = 8 × 5 = 40(平方厘米)。',
            knowledgePoints: ['area', 'rectangle'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 10,
            type: 'single_choice',
            content: '一个正方形的边长是7分米，它的面积是多少平方分米？',
            options: [
                { id: 'A', text: '28平方分米' },
                { id: 'B', text: '35平方分米' },
                { id: 'C', text: '42平方分米' },
                { id: 'D', text: '49平方分米' }
            ],
            correctAnswer: 'D',
            explanation: '正方形面积 = 边长 × 边长 = 7 × 7 = 49(平方分米)。',
            knowledgePoints: ['area', 'square'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 11,
            type: 'single_choice',
            content: '一个长方形的面积是48平方米，长是8米，宽是多少米？',
            options: [
                { id: 'A', text: '4米' },
                { id: 'B', text: '5米' },
                { id: 'C', text: '6米' },
                { id: 'D', text: '7米' }
            ],
            correctAnswer: 'C',
            explanation: '长方形的宽 = 面积 ÷ 长 = 48 ÷ 8 = 6(米)。',
            knowledgePoints: ['area', 'reverse_calculation'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        // 第五单元：年、月、日
        {
            id: 12,
            type: 'single_choice',
            content: '一年有多少个月？',
            options: [
                { id: 'A', text: '10个月' },
                { id: 'B', text: '11个月' },
                { id: 'C', text: '12个月' },
                { id: 'D', text: '13个月' }
            ],
            correctAnswer: 'C',
            explanation: '一年有12个月。',
            knowledgePoints: ['time', 'calendar'],
            difficulty: 'easy',
            estimatedTime: 20
        },
        {
            id: 13,
            type: 'single_choice',
            content: '平年全年有多少天？',
            options: [
                { id: 'A', text: '360天' },
                { id: 'B', text: '364天' },
                { id: 'C', text: '365天' },
                { id: 'D', text: '366天' }
            ],
            correctAnswer: 'C',
            explanation: '平年全年有365天，闰年有366天。',
            knowledgePoints: ['time', 'year_days'],
            difficulty: 'easy',
            estimatedTime: 25
        },
        {
            id: 14,
            type: 'single_choice',
            content: '下面哪个月份有31天？',
            options: [
                { id: 'A', text: '2月' },
                { id: 'B', text: '4月' },
                { id: 'C', text: '6月' },
                { id: 'D', text: '7月' }
            ],
            correctAnswer: 'D',
            explanation: '7月有31天。记忆口诀：一三五七八十腊（12月），三十一天永不差。',
            knowledgePoints: ['time', 'month_days'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 15,
            type: 'single_choice',
            content: '2024年是闰年还是平年？',
            options: [
                { id: 'A', text: '平年' },
                { id: 'B', text: '闰年' },
                { id: 'C', text: '无法判断' },
                { id: 'D', text: '都不是' }
            ],
            correctAnswer: 'B',
            explanation: '2024年能被4整除，所以是闰年。闰年2月有29天。',
            knowledgePoints: ['time', 'leap_year'],
            difficulty: 'medium',
            estimatedTime: 35
        },
        // 第六单元：小数的初步认识
        {
            id: 16,
            type: 'single_choice',
            content: '把1米平均分成10份，每份是多少米？',
            options: [
                { id: 'A', text: '0.01米' },
                { id: 'B', text: '0.1米' },
                { id: 'C', text: '0.2米' },
                { id: 'D', text: '1米' }
            ],
            correctAnswer: 'B',
            explanation: '1米平均分成10份，每份是0.1米，也就是1分米。',
            knowledgePoints: ['decimal', 'decimal_meaning'],
            difficulty: 'easy',
            estimatedTime: 30
        },
        {
            id: 17,
            type: 'single_choice',
            content: '0.5元等于多少角？',
            options: [
                { id: 'A', text: '5角' },
                { id: 'B', text: '50角' },
                { id: 'C', text: '0.5角' },
                { id: 'D', text: '5分' }
            ],
            correctAnswer: 'A',
            explanation: '0.5元 = 5角。1元 = 10角，所以0.5元就是5角。',
            knowledgePoints: ['decimal', 'money_conversion'],
            difficulty: 'easy',
            estimatedTime: 25
        },
        {
            id: 18,
            type: 'single_choice',
            content: '下面哪个数最大？',
            options: [
                { id: 'A', text: '0.3' },
                { id: 'B', text: '0.5' },
                { id: 'C', text: '0.8' },
                { id: 'D', text: '0.2' }
            ],
            correctAnswer: 'C',
            explanation: '0.8 > 0.5 > 0.3 > 0.2，所以0.8最大。',
            knowledgePoints: ['decimal', 'decimal_comparison'],
            difficulty: 'easy',
            estimatedTime: 25
        },
        {
            id: 19,
            type: 'single_choice',
            content: '3.5 + 2.4 = ?',
            options: [
                { id: 'A', text: '5.8' },
                { id: 'B', text: '5.9' },
                { id: 'C', text: '6.0' },
                { id: 'D', text: '6.1' }
            ],
            correctAnswer: 'B',
            explanation: '3.5 + 2.4 = 5.9。小数加法，小数点对齐，相同数位相加。',
            knowledgePoints: ['decimal', 'decimal_addition'],
            difficulty: 'medium',
            estimatedTime: 35
        },
        // 第七单元：数学广角（搭配问题）
        {
            id: 20,
            type: 'single_choice',
            content: '小明有2件上衣（红色、蓝色）和3条裤子（黑色、白色、灰色），一共可以搭配出多少种不同的穿法？',
            options: [
                { id: 'A', text: '4种' },
                { id: 'B', text: '5种' },
                { id: 'C', text: '6种' },
                { id: 'D', text: '7种' }
            ],
            correctAnswer: 'C',
            explanation: '2 × 3 = 6(种)。每件上衣都可以与3条裤子搭配，所以一共有6种穿法。',
            knowledgePoints: ['combination', 'pairing_problem'],
            difficulty: 'medium',
            estimatedTime: 40
        },
        {
            id: 21,
            type: 'single_choice',
            content: '用数字2、3、5可以组成多少个不同的两位数？',
            options: [
                { id: 'A', text: '3个' },
                { id: 'B', text: '4个' },
                { id: 'C', text: '5个' },
                { id: 'D', text: '6个' }
            ],
            correctAnswer: 'D',
            explanation: '可以组成：23、25、32、35、52、53，共6个不同的两位数。',
            knowledgePoints: ['combination', 'number_formation'],
            difficulty: 'medium',
            estimatedTime: 45
        },
        // 综合应用题
        {
            id: 22,
            type: 'single_choice',
            content: '一个长方形花坛，长12米，宽8米。如果在花坛周围铺一条1米宽的小路，小路的面积是多少平方米？',
            options: [
                { id: 'A', text: '40平方米' },
                { id: 'B', text: '44平方米' },
                { id: 'C', text: '48平方米' },
                { id: 'D', text: '52平方米' }
            ],
            correctAnswer: 'B',
            explanation: '大长方形面积：(12+1+1) × (8+1+1) = 14 × 10 = 140(平方米)，小长方形面积：12 × 8 = 96(平方米)，小路面积：140 - 96 = 44(平方米)。',
            knowledgePoints: ['area', 'composite_problem'],
            difficulty: 'hard',
            estimatedTime: 60
        },
        {
            id: 23,
            type: 'single_choice',
            content: '商店运来苹果和梨共120箱，苹果比梨多20箱。苹果有多少箱？',
            options: [
                { id: 'A', text: '50箱' },
                { id: 'B', text: '60箱' },
                { id: 'C', text: '70箱' },
                { id: 'D', text: '80箱' }
            ],
            correctAnswer: 'C',
            explanation: '设梨有x箱，则苹果有x+20箱。x + (x+20) = 120，2x = 100，x = 50。所以苹果有50 + 20 = 70箱。',
            knowledgePoints: ['word_problem', 'equation_thinking'],
            difficulty: 'hard',
            estimatedTime: 50
        },
        {
            id: 24,
            type: 'single_choice',
            content: '小华在计算除法时，把除数6看成了9，结果得到商是4。正确的商应该是多少？',
            options: [
                { id: 'A', text: '5' },
                { id: 'B', text: '6' },
                { id: 'C', text: '7' },
                { id: 'D', text: '8' }
            ],
            correctAnswer: 'B',
            explanation: '看成9得到商4，说明被除数是9×4=36。正确的算式是36÷6=6。',
            knowledgePoints: ['division', 'reverse_thinking'],
            difficulty: 'hard',
            estimatedTime: 55
        },
        {
            id: 25,
            type: 'single_choice',
            content: '一根绳子长24米，第一次用去全长的1/3，第二次用去全长的1/4，还剩多少米？',
            options: [
                { id: 'A', text: '8米' },
                { id: 'B', text: '10米' },
                { id: 'C', text: '12米' },
                { id: 'D', text: '14米' }
            ],
            correctAnswer: 'B',
            explanation: '第一次用去：24 × 1/3 = 8米，第二次用去：24 × 1/4 = 6米，还剩：24 - 8 - 6 = 10米。',
            knowledgePoints: ['fraction', 'composite_calculation'],
            difficulty: 'hard',
            estimatedTime: 50
        }
    ];
}
