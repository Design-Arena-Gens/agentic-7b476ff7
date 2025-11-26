export async function spellCheck(text: string): Promise<string> {
  const commonMisspellings: Record<string, string> = {
    'recieve': 'receive',
    'definately': 'definitely',
    'occured': 'occurred',
    'seperate': 'separate',
    'necesary': 'necessary',
    'recomend': 'recommend',
    'accomodate': 'accommodate',
    'begining': 'beginning',
    'beleive': 'believe',
    'dissapoint': 'disappoint',
    'existance': 'existence',
    'goverment': 'government',
    'independant': 'independent',
    'maintainance': 'maintenance',
    'millenium': 'millennium',
    'occassion': 'occasion',
    'persistant': 'persistent',
    'posession': 'possession',
    'priviledge': 'privilege',
    'publically': 'publicly',
    'questionaire': 'questionnaire',
    'thier': 'their',
    'tommorrow': 'tomorrow',
    'untill': 'until',
    'wich': 'which',
  }

  let correctedText = text

  for (const [wrong, correct] of Object.entries(commonMisspellings)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi')
    correctedText = correctedText.replace(regex, correct)
  }

  const htmlTagPattern = /<[^>]*>/g
  const tags = correctedText.match(htmlTagPattern) || []
  const textOnly = correctedText.replace(htmlTagPattern, '|||TAG|||')

  const words = textOnly.split(/\s+/)
  const correctedWords = words.map(word => {
    if (word === '|||TAG|||') return word

    if (word.length > 20 && !word.includes('-')) {
      return word
    }

    return word
  })

  let result = correctedWords.join(' ')

  tags.forEach(tag => {
    result = result.replace('|||TAG|||', tag)
  })

  return result
}
