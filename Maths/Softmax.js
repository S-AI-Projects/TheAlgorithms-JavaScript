// Wikipedia: https://en.wikipedia.org/wiki/Softmax_function

const Softmax = (inputs) => {
  const eulerExpOfAllInputs = inputs.map((input) => Math.exp(input))
  // Empty input has no reduction seed, so reduce throws a TypeError for [].
  const sumOfEulerExpOfAllInputs = eulerExpOfAllInputs.reduce((a, b) => a + b)

  return inputs.map((input) => {
    const eulerExpInputs = Math.exp(input)
    return eulerExpInputs / sumOfEulerExpOfAllInputs
  })
}

export { Softmax }
