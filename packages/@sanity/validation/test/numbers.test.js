const {Rule} = require('../src')

describe('number', () => {
  test('required constraint', async () => {
    const rule = Rule.number().required()
    await expect(rule.validate(undefined)).resolves.toMatchSnapshot('required: undefined')
    await expect(rule.validate(13)).resolves.toMatchSnapshot('required: valid')
  })

  test('min constraint', async () => {
    const rule = Rule.number().min(10)
    await expect(rule.validate(3)).resolves.toMatchSnapshot('min: too low')
    await expect(rule.validate(10)).resolves.toMatchSnapshot('min: valid, at limit')
    await expect(rule.validate(20)).resolves.toMatchSnapshot('min: valid')
  })

  test('greater than constraint', async () => {
    const rule = Rule.number().greaterThan(10)
    await expect(rule.validate(3)).resolves.toMatchSnapshot('gt: too low')
    await expect(rule.validate(10)).resolves.toMatchSnapshot('gt: too low, at limit')
    await expect(rule.validate(20)).resolves.toMatchSnapshot('gt: valid')
  })

  test('max constraint', async () => {
    const rule = Rule.number().max(10)
    await expect(rule.validate(20)).resolves.toMatchSnapshot('max: too large')
    await expect(rule.validate(10)).resolves.toMatchSnapshot('max: valid, at limit')
    await expect(rule.validate(5)).resolves.toMatchSnapshot('max: valid')
  })

  test('less than constraint', async () => {
    const rule = Rule.number().lessThan(10)
    await expect(rule.validate(20)).resolves.toMatchSnapshot('lt: too high')
    await expect(rule.validate(10)).resolves.toMatchSnapshot('lt: too high, at limit')
    await expect(rule.validate(3)).resolves.toMatchSnapshot('lt: valid')
  })

  test('integer constraint', async () => {
    const rule = Rule.number().integer()
    await expect(rule.validate(31.14)).resolves.toMatchSnapshot('integer: invalid (float)')
    await expect(rule.validate(31)).resolves.toMatchSnapshot('integer: valid')
  })

  test('precision constraint', async () => {
    const rule = Rule.number().precision(3)
    await expect(rule.validate(Math.PI)).resolves.toMatchSnapshot('precision: invalid (pi)')
    await expect(rule.validate(31.133)).resolves.toMatchSnapshot('precision: valid (at limit)')
    await expect(rule.validate(31.3)).resolves.toMatchSnapshot('precision: valid (below limit)')
  })

  test('positive constraint', async () => {
    const rule = Rule.number().positive()
    await expect(rule.validate(-31.14)).resolves.toMatchSnapshot('positive: invalid')
    await expect(rule.validate(0)).resolves.toMatchSnapshot('positive: valid (zero)')
    await expect(rule.validate(13)).resolves.toMatchSnapshot('positive: valid')
  })

  test('negative constraint', async () => {
    const rule = Rule.number().negative()
    await expect(rule.validate(31.14)).resolves.toMatchSnapshot('negative: invalid')
    await expect(rule.validate(0)).resolves.toMatchSnapshot('negative: invalid (zero)')
    await expect(rule.validate(-13)).resolves.toMatchSnapshot('negative: valid')
  })
})
