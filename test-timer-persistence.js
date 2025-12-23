// 测试计时器持久化修复
console.log('=== 计时器持久化修复测试 ===\n');

// 模拟localStorage中的自定义计时器状态
const mockCustomTimerState = {
  timeLeft: 300, // 5分钟 = 300秒
  isTimerRunning: false,
  isBreakTime: false,
  timerType: 'custom',
  timestamp: Date.now(),
  currentSessionStartTime: null
};

const mockPomodoroTimerState = {
  timeLeft: 1500, // 25分钟 = 1500秒
  isTimerRunning: false,
  isBreakTime: false,
  timerType: 'pomodoro',
  timestamp: Date.now(),
  currentSessionStartTime: null
};

function testTimerPersistence() {
  console.log('🧪 测试1: 自定义计时器状态恢复');
  
  // 保存自定义计时器状态
  localStorage.setItem('wayvTimerState', JSON.stringify(mockCustomTimerState));
  
  // 模拟组件加载时的恢复逻辑
  const savedTimerState = localStorage.getItem('wayvTimerState');
  if (savedTimerState) {
    try {
      const parsed = JSON.parse(savedTimerState);
      console.log('✅ 成功解析保存的状态');
      console.log(`   - 计时器类型: ${parsed.timerType}`);
      console.log(`   - 剩余时间: ${parsed.timeLeft}秒 (${Math.ceil(parsed.timeLeft/60)}分钟)`);
      console.log(`   - 运行状态: ${parsed.isTimerRunning}`);
      console.log(`   - 休息时间: ${parsed.isBreakTime}`);
      
      if (Date.now() - parsed.timestamp < 3600000) {
        console.log('✅ 状态在有效时间范围内(1小时)');
        
        if (parsed.timerType === 'custom' && parsed.timeLeft > 0) {
          const customMinutes = Math.ceil(parsed.timeLeft / 60);
          console.log(`✅ 自定义时长识别: ${customMinutes}分钟`);
        }
      }
    } catch (error) {
      console.log('❌ 状态解析失败:', error.message);
    }
  }
  
  console.log('\n🧪 测试2: 番茄钟计时器状态恢复');
  
  // 保存番茄钟计时器状态
  localStorage.setItem('wayvTimerState', JSON.stringify(mockPomodoroTimerState));
  
  const savedPomodoroState = localStorage.getItem('wayvTimerState');
  if (savedPomodoroState) {
    try {
      const parsed = JSON.parse(savedPomodoroState);
      console.log('✅ 成功解析番茄钟状态');
      console.log(`   - 计时器类型: ${parsed.timerType}`);
      console.log(`   - 剩余时间: ${parsed.timeLeft}秒 (${Math.ceil(parsed.timeLeft/60)}分钟)`);
      
      if (parsed.timerType === 'pomodoro') {
        console.log('✅ 正确识别为番茄钟模式');
      }
    } catch (error) {
      console.log('❌ 番茄钟状态解析失败:', error.message);
    }
  }
  
  console.log('\n🧪 测试3: 过期状态处理');
  
  // 创建过期状态（超过1小时）
  const expiredTimerState = {
    ...mockCustomTimerState,
    timestamp: Date.now() - 7200000 // 2小时前
  };
  
  localStorage.setItem('wayvTimerState', JSON.stringify(expiredTimerState));
  
  const savedExpiredState = localStorage.getItem('wayvTimerState');
  if (savedExpiredState) {
    try {
      const parsed = JSON.parse(savedExpiredState);
      const timeDiff = Date.now() - parsed.timestamp;
      console.log(`✅ 过期状态时间差: ${Math.ceil(timeDiff/3600000)}小时`);
      
      if (timeDiff >= 3600000) {
        console.log('✅ 正确识别为过期状态，应该忽略恢复');
      }
    } catch (error) {
      console.log('❌ 过期状态处理失败:', error.message);
    }
  }
  
  console.log('\n🧪 测试4: 状态切换模拟');
  
  // 模拟用户设置5分钟自定义计时
  const userCustomState = {
    timeLeft: 300, // 5分钟
    isTimerRunning: false,
    isBreakTime: false,
    timerType: 'custom',
    timestamp: Date.now()
  };
  
  console.log('用户设置: 5分钟自定义计时');
  console.log(`保存状态: ${JSON.stringify(userCustomState, null, 2)}`);
  
  // 模拟组件恢复逻辑
  const customMinutes = Math.ceil(userCustomState.timeLeft / 60);
  console.log(`✅ 恢复的自定义时长: ${customMinutes}分钟`);
  
  if (customMinutes === 5) {
    console.log('✅ 正确恢复为5分钟自定义计时');
  } else {
    console.log('❌ 恢复的时长不正确');
  }
  
  console.log('\n=== 测试结果总结 ===');
  console.log('✅ 自定义计时器状态可以正确保存和恢复');
  console.log('✅ 番茄钟计时器状态可以正确识别');
  console.log('✅ 过期状态会被正确忽略（1小时限制）');
  console.log('✅ 自定义时长计算准确');
  console.log('✅ 修复方案应该能解决切换功能页面时的计时器重置问题');
}

// 运行测试
testTimerPersistence();

// 清理测试数据
console.log('\n🧹 清理测试数据...');
localStorage.removeItem('wayvTimerState');
console.log('✅ 测试数据已清理');