import _ from 'lodash'
import hash from '@amendable/hash'

const hoverRegex = /^hover(.*)/
export default () => (props, { applyResolvers }) => {
  const result = _.cloneDeep(props)

  _.each(result, (value, key) => {
    const match = key.match(hoverRegex)
    if (!match) return

    const property = _.camelCase(match[1])
    const variableName = `--amendable-hover-${hash(
      JSON.stringify({ [key]: value })
    )}`
    const resolvedValue = _.get(applyResolvers({ [property]: value }), [
      'style',
      property,
    ])

    const additionalCss = `.${variableName}:hover {
  ${variableName}: ${resolvedValue || value};
}`
    result.css = [result.css || '', additionalCss].join('\n')

    result[property] = `var(${variableName}, ${props[property] || 'inherit'})`
    result.className = variableName
  })

  return result
}
