"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Word, vocabulary, POS_COLORS } from "@/lib/vocabulary";
import { addSession, getProgress, markWordsLearned } from "@/lib/storage";

// Extended decoy words grouped by first letter for same-letter decoy generation
const DECOY_WORDS_BY_LETTER: Record<string, string[]> = {
  a: ['about','above','across','after','again','against','along','already','also','always','among','another','answer','any','apple','arm','around','art','ask'],
  b: ['baby','back','bad','bag','bank','bath','beach','bear','bed','beer','before','begin','behind','believe','below','best','better','between','big','bird','black','blood','blue','boat','body','bone','book','both','bottom','box','boy','brain','bread','break','bridge','bright','bring','brother','brown','build','burn','bus','busy','buy'],
  c: ['call','calm','came','can','car','card','care','carry','cat','catch','cause','center','chair','chance','change','cheap','cheese','chicken','child','church','city','class','clean','clear','climb','close','clothes','cloud','coat','coffee','cold','color','come','common','computer','cook','cool','corner','cost','count','country','course','cover','create','cross','cup','cut'],
  d: ['dance','danger','dark','daughter','day','dead','dear','decide','deep','desk','develop','die','difficult','dinner','dirty','discover','dish','doctor','dog','dollar','done','door','double','down','draw','dream','dress','drink','drive','drop','dry','during'],
  e: ['each','ear','early','earth','east','easy','eat','edge','egg','eight','either','else','empty','end','enemy','energy','engine','enjoy','enough','enter','even','evening','ever','every','example','except','excited','exercise','expect','experience','explain','eye'],
  f: ['face','fact','fail','fair','fall','family','famous','far','farm','fast','fat','father','fear','feel','few','field','fight','fill','final','find','fine','finger','finish','fire','first','fish','fit','five','flat','flight','floor','flower','fly','follow','food','foot','for','force','foreign','forest','forget','form','forward','four','free','fresh','friend','front','fruit','full','fun','future'],
  g: ['game','garden','gate','general','gentle','get','gift','girl','give','glad','glass','go','god','gold','good','government','grab','grade','grand','grass','gray','great','green','ground','group','grow','guard','guess','guide','gun','guy'],
  h: ['hair','half','hall','hand','hang','happen','happy','hard','hat','hate','have','he','head','health','hear','heart','heat','heavy','help','here','herself','high','hill','him','himself','history','hit','hold','hole','home','hope','horse','hospital','hot','hotel','hour','house','how','huge','human','hundred','hungry','hunt','hurry','hurt','husband'],
  i: ['ice','idea','if','image','imagine','important','improve','in','include','increase','indeed','inside','instead','interest','into','iron','island','issue','it','item','itself'],
  j: ['jacket','job','join','joke','journey','joy','judge','juice','jump','just'],
  k: ['keep','key','kid','kill','kind','king','kiss','kitchen','knee','knife','knock','know'],
  l: ['lady','lake','land','language','large','last','late','laugh','law','lay','lead','leaf','learn','least','leave','left','leg','less','lesson','let','letter','level','library','lie','life','lift','light','like','limit','line','lip','list','listen','little','live','long','look','lose','lot','love','low','luck','lunch'],
  m: ['machine','mad','main','major','make','male','man','manage','many','map','mark','market','marry','master','match','matter','may','maybe','me','meal','mean','meat','medicine','meet','member','memory','mention','message','method','middle','might','mile','milk','million','mind','mine','minute','miss','mistake','mix','model','modern','moment','money','month','moon','more','morning','most','mother','mountain','mouth','move','much','music','must','my','myself'],
  n: ['name','narrow','nation','nature','near','necessary','neck','need','neighbor','neither','nerve','never','new','news','next','nice','night','nine','no','nobody','nod','noise','none','nor','normal','north','nose','not','note','nothing','notice','now','number','nurse'],
  o: ['object','occur','ocean','of','off','offer','office','officer','often','oil','old','on','once','one','only','open','operate','opinion','opposite','or','orange','order','other','otherwise','our','out','outside','over','own'],
  p: ['page','pain','paint','pair','palace','pale','pan','pants','paper','parent','park','part','particular','partner','party','pass','past','path','patient','pattern','pay','peace','pen','people','perfect','perhaps','period','permit','person','phone','pick','picture','piece','pig','pin','pink','place','plan','plant','plate','play','please','plenty','pocket','poem','point','police','pool','poor','popular','position','possible','pot','pour','power','practice','prepare','present','president','press','pretty','prevent','price','prince','private','prize','probably','problem','produce','program','promise','protect','prove','provide','pull','purple','purpose','push','put'],
  q: ['quarter','queen','question','quick','quiet','quite','quote'],
  r: ['race','radio','rain','raise','range','rapid','rare','rate','rather','reach','read','ready','real','realize','reason','receive','record','red','reduce','region','regret','relate','remain','remember','remove','repeat','replace','reply','report','represent','require','rest','result','return','rich','ride','right','ring','rise','risk','river','road','rock','role','roll','roof','room','root','rope','rose','rough','round','row','rub','rule','run','rush'],
  s: ['sad','safe','sail','salt','same','sand','save','say','scene','school','science','sea','search','season','seat','second','secret','section','see','seed','seem','self','sell','send','sense','sentence','separate','serious','serve','service','set','settle','seven','several','shake','shall','shape','share','sharp','she','sheet','shell','shift','shine','ship','shirt','shock','shoe','shoot','shop','short','shot','should','shoulder','shout','show','shut','sick','side','sight','sign','silence','silly','silver','similar','simple','since','sing','sir','sister','sit','situation','six','size','skill','skin','sky','sleep','slide','slip','slow','small','smell','smile','smoke','smooth','snow','so','social','soft','soil','soldier','solution','some','son','song','soon','sorry','sort','soul','sound','south','space','speak','special','speech','speed','spend','spirit','spot','spread','spring','square','stage','stand','star','start','state','station','stay','steal','step','stick','still','stock','stomach','stone','stop','store','storm','story','straight','strange','street','stretch','strike','strong','structure','student','study','stupid','subject','succeed','such','sudden','suffer','sugar','suggest','suit','summer','sun','supply','support','suppose','sure','surface','surprise','surround','sweet','swim','system'],
  t: ['table','tail','take','talk','tall','taste','teach','teacher','team','tear','telephone','tell','temperature','ten','tend','term','test','than','thank','that','the','their','them','themselves','then','there','therefore','these','they','thick','thin','thing','think','third','this','those','though','thought','thousand','three','throat','through','throw','thus','tie','tight','time','tiny','tired','to','today','together','tomorrow','tonight','too','tool','top','total','touch','toward','town','trade','train','travel','tree','trip','trouble','truck','true','trust','truth','try','turn','twelve','twenty','twice','two','type'],
  u: ['ugly','uncle','under','understand','union','unit','university','unless','until','up','upon','upper','upset','us','use','used','useful','usual'],
  v: ['valley','value','various','vegetable','vehicle','version','very','victory','view','village','visit','voice','volume','vote'],
  w: ['wait','wake','walk','wall','want','war','warm','warn','wash','watch','water','wave','way','we','weak','wealth','wear','weather','wedding','week','weight','welcome','well','west','western','wet','what','whatever','wheel','when','where','whether','which','while','whisper','white','who','whole','whom','whose','why','wide','wife','wild','will','win','wind','window','wine','wing','winter','wire','wise','wish','with','within','without','woman','wonder','wood','word','work','world','worry','worse','worst','worth','would','wrap','write','wrong'],
  x: ['x-ray'],
  y: ['yard','yeah','year','yellow','yes','yesterday','yet','you','young','your','yourself','youth'],
  z: ['zero','zone','zoo'],
};

interface QuizQuestion {
  word: Word;
  options: string[];
  correctIndex: number;
}

function generateQuiz(words: Word[], count: number = 10): QuizQuestion[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(word => {
    const correctAnswer = word.english;
    const firstLetter = correctAnswer[0].toLowerCase();
    
    // Get one same-letter decoy
    const sameLetterPool = (DECOY_WORDS_BY_LETTER[firstLetter] || [])
      .filter(w => w.toLowerCase() !== correctAnswer.toLowerCase());
    const sameLetterDecoy = sameLetterPool.length > 0
      ? sameLetterPool[Math.floor(Math.random() * sameLetterPool.length)]
      : null;

    // Get remaining wrong answers from vocabulary (different words)
    const vocabWrong = vocabulary
      .filter(w => w.id !== word.id && w.english.toLowerCase() !== correctAnswer.toLowerCase())
      .sort(() => Math.random() - 0.5)
      .map(w => w.english);

    const wrongAnswers: string[] = [];
    if (sameLetterDecoy) wrongAnswers.push(sameLetterDecoy);
    
    // Fill remaining slots (need 3 wrong total)
    for (const w of vocabWrong) {
      if (wrongAnswers.length >= 3) break;
      if (!wrongAnswers.includes(w)) wrongAnswers.push(w);
    }
    // Fallback if not enough
    while (wrongAnswers.length < 3) {
      const fallback = sameLetterPool[Math.floor(Math.random() * sameLetterPool.length)] || 'unknown';
      if (!wrongAnswers.includes(fallback)) wrongAnswers.push(fallback);
    }

    const options = [...wrongAnswers.slice(0, 3), correctAnswer].sort(() => Math.random() - 0.5);
    return {
      word,
      options,
      correctIndex: options.indexOf(correctAnswer),
    };
  });
}

type QuizMode = 'multiple-choice' | 'type-answer';

export default function QuizPage() {
  const router = useRouter();
  const [quizMode, setQuizMode] = useState<QuizMode>('multiple-choice');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [complete, setComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [correctWordIds, setCorrectWordIds] = useState<number[]>([]);
  
  // Typing mode state
  const [typedAnswer, setTypedAnswer] = useState('');
  const [typingCorrect, setTypingCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let quizWords: Word[];
    try {
      const stored = sessionStorage.getItem('nle-quiz-words');
      if (stored) {
        quizWords = JSON.parse(stored);
      } else {
        quizWords = vocabulary.filter(w => w.tier === 1);
      }
    } catch {
      quizWords = vocabulary.filter(w => w.tier === 1);
    }
    
    setQuestions(generateQuiz(quizWords, Math.min(10, quizWords.length)));
  }, []);

  // Focus input in typing mode
  useEffect(() => {
    if (quizMode === 'type-answer' && !showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQ, quizMode, showResult]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    
    if (index === questions[currentQ].correctIndex) {
      setScore(s => s + 1);
      setCorrectWordIds(prev => [...prev, questions[currentQ].word.id]);
    }
  };

  const handleTypingSubmit = () => {
    if (showResult || !typedAnswer.trim()) return;
    const correct = questions[currentQ].word.english.toLowerCase().trim();
    const typed = typedAnswer.toLowerCase().trim();
    // Allow matching the first meaning (before " / ")
    const meanings = correct.split(' / ').map(m => m.trim().toLowerCase());
    const isCorrect = meanings.some(m => m === typed) || correct === typed;
    
    setTypingCorrect(isCorrect);
    setShowResult(true);
    if (isCorrect) {
      setScore(s => s + 1);
      setCorrectWordIds(prev => [...prev, questions[currentQ].word.id]);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      if (score / questions.length >= 0.8) {
        markWordsLearned(correctWordIds);
      }
      
      const progress = getProgress();
      if (progress.sessions.length > 0) {
        const last = progress.sessions[progress.sessions.length - 1];
        last.quizScore = score + (
          quizMode === 'multiple-choice'
            ? (selected === questions[currentQ]?.correctIndex ? 1 : 0)
            : (typingCorrect ? 1 : 0)
        );
        last.quizTotal = questions.length;
      }
      
      setComplete(true);
      return;
    }
    
    setCurrentQ(q => q + 1);
    setSelected(null);
    setShowResult(false);
    setTypedAnswer('');
    setTypingCorrect(null);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--nle-muted)]">Loading quiz...</p>
      </div>
    );
  }

  if (complete) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const wordsPerMin = elapsed > 0 ? Math.round((finalScore / elapsed) * 60) : 0;

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel border-glow max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Results</h2>
          
          <div className="text-6xl font-black my-6">
            <span className={pct >= 80 ? 'text-green-400 glow-green' : pct >= 60 ? 'text-yellow-400' : 'text-orange-400'}>
              {pct}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Score</p>
              <p className="text-lg font-bold text-white">{finalScore}/{questions.length}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Time</p>
              <p className="text-lg font-bold text-white">{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Words/min</p>
              <p className="text-lg font-bold text-blue-400">{wordsPerMin}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Mode</p>
              <p className="text-lg font-bold text-purple-400">{quizMode === 'type-answer' ? '⌨️ Type' : '📋 MC'}</p>
            </div>
          </div>

          {pct >= 80 && (
            <p className="text-sm text-green-400 mb-4">
              ✨ Words marked as learned! Great encoding!
            </p>
          )}

          <div className="space-y-3">
            <button onClick={() => router.push('/learn')} className="btn-primary w-full">
              Encode More Words
            </button>
            <button onClick={() => router.push('/dashboard')} className="w-full py-2 text-sm text-[var(--nle-muted)] hover:text-white">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Mode Toggle */}
      <div className="w-full max-w-md mb-4">
        <div className="flex rounded-lg overflow-hidden border border-[var(--nle-border)]">
          <button
            onClick={() => { setQuizMode('multiple-choice'); setTypedAnswer(''); setTypingCorrect(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              quizMode === 'multiple-choice'
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                : 'text-[var(--nle-muted)] hover:text-white'
            }`}
          >
            📋 Multiple Choice
          </button>
          <button
            onClick={() => { setQuizMode('type-answer'); setSelected(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              quizMode === 'type-answer'
                ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                : 'text-[var(--nle-muted)] hover:text-white'
            }`}
          >
            ⌨️ Type Answer
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-[var(--nle-muted)] mb-2">
          <span>Question {currentQ + 1}/{questions.length}</span>
          <span>Score: {score}/{currentQ + (showResult ? 1 : 0)}</span>
        </div>
        <div className="h-1 bg-[var(--nle-border)] rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="panel border-glow max-w-md w-full p-6 sm:p-8">
        {/* Word */}
        <div className="text-center mb-8">
          <p className="text-xs text-[var(--nle-muted)] mb-2 uppercase tracking-wider">{q.word.pos}</p>
          <p className="font-bold" style={{ color: POS_COLORS[q.word.pos], fontSize: 'clamp(2rem, 7vw, 2.5rem)' }}>
            {q.word.spanish}
          </p>
          <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-[var(--nle-muted)] mt-1 font-mono">/{q.word.phonetic}/</p>
        </div>

        {/* Multiple Choice Mode */}
        {quizMode === 'multiple-choice' && (
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = "border-[var(--nle-border)] hover:border-blue-500/50";
              if (showResult) {
                if (i === q.correctIndex) style = "border-green-500 bg-green-500/10 text-green-400";
                else if (i === selected) style = "border-orange-500 bg-orange-500/10 text-orange-400";
              } else if (i === selected) {
                style = "border-blue-500 bg-blue-500/10";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-3 sm:p-4 rounded-lg border text-left transition-all ${style}`}
                >
                  <span className="text-xs text-[var(--nle-muted)] mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Type Answer Mode */}
        {quizMode === 'type-answer' && (
          <div>
            {!showResult ? (
              <form onSubmit={(e) => { e.preventDefault(); handleTypingSubmit(); }} className="space-y-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type the English translation..."
                  className="w-full p-4 rounded-lg border border-[var(--nle-border)] bg-[var(--nle-surface)] text-white text-center text-lg focus:outline-none focus:border-purple-500 transition-colors"
                  autoComplete="off"
                  autoCapitalize="off"
                />
                <button
                  type="submit"
                  disabled={!typedAnswer.trim()}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </form>
            ) : (
              <div className="text-center space-y-3">
                <div className="text-4xl">{typingCorrect ? '✅' : '❌'}</div>
                {!typingCorrect && (
                  <div>
                    <p className="text-sm text-[var(--nle-muted)]">Your answer: <span className="text-orange-400 line-through">{typedAnswer}</span></p>
                    <p className="text-sm text-[var(--nle-muted)]">Correct: <span className="text-green-400 font-bold">{q.word.english}</span></p>
                  </div>
                )}
                {typingCorrect && (
                  <p className="text-green-400 font-bold">{q.word.english}</p>
                )}
              </div>
            )}
          </div>
        )}

        {showResult && (
          <div className="mt-6">
            <p className="text-sm text-[var(--nle-muted)] italic mb-4">
              &ldquo;{q.word.example}&rdquo;
            </p>
            <button onClick={nextQuestion} className="btn-primary w-full">
              {currentQ + 1 >= questions.length ? 'See Results' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
