'use client'

import { useState } from 'react'
import { Film, QuizQuestion } from '@/types'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  film: Film | null
  questions: QuizQuestion | undefined
  onQuizComplete: (filmId: number) => void
}

export default function QuizModal({
  isOpen,
  onClose,
  film,
  questions: quizData,
  onQuizComplete,
}: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen || !film || !quizData) return null

  const allAnswered = quizData.questions.every((q) => answers[q.id] !== undefined)

  const handleSubmit = () => {
    if (!allAnswered || submitted) return
    setSubmitted(true)
    const allCorrect = quizData.questions.every((q) => answers[q.id] === q.answer)
    if (allCorrect) {
      onQuizComplete(film.id)
    }
  }

  const handleClose = () => {
    setAnswers({})
    setSubmitted(false)
    onClose()
  }

  const allCorrect = submitted
    ? quizData.questions.every((q) => answers[q.id] === q.answer)
    : false

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="modal-content w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col" style={{ backgroundColor: '#EBE3D5' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid #C8A87820' }}>
          <div>
            <h2 className="font-serif text-lg font-bold" style={{ color: '#2C241C' }}>
              📝 知识问答
            </h2>
            <p className="text-xs font-sans opacity-50 mt-0.5" style={{ color: '#2C241C' }}>
              《{film.name}》· {film.year}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: '#2C241C' }}
          >
            ✕
          </button>
        </div>

        {/* Rules banner */}
        <div className="mx-6 mt-4 rounded-xl px-4 py-3 text-xs font-sans leading-relaxed" style={{ backgroundColor: '#F6F2E9', color: '#2C241C' }}>
          <p className="font-bold mb-1" style={{ color: '#C8A878' }}>答题须知</p>
          <p className="opacity-70">
            本片共设2道知识问答题，全部答对该影片即为通关，答错可重新作答。
          </p>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {quizData.questions.map((q, qIdx) => (
            <div key={q.id}>
              <p className="font-sans text-sm font-medium mb-3" style={{ color: '#2C241C' }}>
                Q{qIdx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx
                  const isCorrectOption = q.answer === optIdx

                  let borderColor = '#C8A87840'
                  let bgColor = 'transparent'

                  if (submitted) {
                    if (isCorrectOption) {
                      borderColor = '#6D8B68'
                      bgColor = '#6D8B6815'
                    } else if (isSelected && !isCorrectOption) {
                      borderColor = '#A85C50'
                      bgColor = '#A85C5015'
                    }
                  } else if (isSelected) {
                    borderColor = '#C8A878'
                    bgColor = '#C8A87815'
                  }

                  return (
                    <label
                      key={optIdx}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 cursor-pointer transition-all text-sm font-sans"
                      style={{
                        border: `1.5px solid ${borderColor}`,
                        backgroundColor: bgColor,
                        color: '#2C241C',
                        cursor: submitted ? 'default' : 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() => {
                          if (!submitted) {
                            setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                        }}
                        className="sr-only"
                      />
                      <span
                        className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] font-bold transition-all"
                        style={{
                          borderColor: isSelected
                            ? (submitted ? (isCorrectOption ? '#6D8B68' : '#A85C50') : '#C8A878')
                            : '#C8A87860',
                          backgroundColor: isSelected
                            ? (submitted ? (isCorrectOption ? '#6D8B68' : '#A85C50') : '#C8A878')
                            : 'transparent',
                          color: isSelected ? '#fff' : 'transparent',
                        }}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isCorrectOption && (
                        <span className="text-xs font-bold" style={{ color: '#6D8B68' }}>正确答案</span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2">
          {submitted && (
            <div
              className="rounded-xl px-4 py-3 mb-3 text-sm font-sans text-center font-bold"
              style={{
                backgroundColor: allCorrect ? '#6D8B6815' : '#A85C5015',
                color: allCorrect ? '#6D8B68' : '#A85C50',
              }}
            >
              {allCorrect ? '🎉 全部正确，答题通关！' : '答错了，请仔细回顾影片资料后再试'}
            </div>
          )}

          {submitted && !allCorrect ? (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-serif font-bold border-2 transition-all cursor-pointer"
                style={{ borderColor: '#C8A87840', color: '#2C241C' }}
              >
                关闭
              </button>
              <button
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                }}
                className="btn-retro flex-1 text-sm font-serif"
              >
                重新作答
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn-retro w-full text-sm font-serif disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitted ? '关闭' : '提交答案'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
