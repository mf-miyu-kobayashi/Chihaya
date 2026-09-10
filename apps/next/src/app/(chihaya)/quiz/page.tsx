"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { KimarijiText } from "@/components/KimarijiText";
import { RubyText } from "@/components/RubyText";
import { SectionTitle } from "@/components/SectionTitle";
import { fetchFavorites } from "@/lib/favorites";
import { fetchPoems, type Poem } from "@/lib/poems";
import { fetchWeakPoems, postQuizResult } from "@/lib/quizResults";
import {
  createQuiz,
  filterByKimarijiLength,
  QUIZ_LENGTH,
  saveQuizResult,
  type KimarijiLength,
  type QuizAnswer,
  type QuizQuestion,
  type QuizRange,
} from "@/lib/quiz";

/**
 * クイズ画面（URL: /quiz ）。仕様12〜16章
 *
 * useSearchParams（?poemId=17 のような検索パラメータを読む）を使うため、
 * Next.js の決まりで <Suspense> で囲む必要がある。
 */
export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 詳細画面の「この歌でクイズ」から来た場合は ?poemId=17 が付いている
  const requestedPoemId = Number(searchParams.get("poemId")) || null;

  // ---- 仕様27章で挙げられている「クイズが持つ状態」----
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // 出題する問題
  const [currentIndex, setCurrentIndex] = useState(0); // 現在の問題番号（0から数える）
  const [selected, setSelected] = useState<Poem | null>(null); // 選んだ回答
  const [answers, setAnswers] = useState<QuizAnswer[]>([]); // これまでの回答記録
  // --------------------------------------------------------

  // ---- クイズ設定（開始前に選ぶ）----
  const [range, setRange] = useState<QuizRange>("all"); // 出題範囲
  const [kimarijiLength, setKimarijiLength] = useState<KimarijiLength>("any");
  const [kimarijiOnly, setKimarijiOnly] = useState(false); // 決まり字だけ見せるモード

  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchPoems()
      .then((data) => {
        setPoems(data);
        // 「この歌でクイズ」から来たときは設定を飛ばしてすぐ始める
        if (requestedPoemId) {
          const firstPoem = data.find((p) => p.id === requestedPoemId);
          setQuestions(createQuiz(data, data, firstPoem));
        }
      })
      .catch(() => setError("データを取得できませんでした。もう一度お試しください。"))
      .finally(() => setLoading(false));
  }, [requestedPoemId]);

  /** 設定にしたがって出題対象の歌を集め、クイズを始める */
  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      // ① 出題範囲で絞る
      let targets: Poem[] = poems;
      if (range === "weak") {
        const weak = await fetchWeakPoems(30);
        // APIは「歌のID・番号・上の句」だけ返すので、全100首から本体を引き当てる
        targets = weak
          .map((w) => poems.find((p) => p.id === w.poem_id))
          .filter((p): p is Poem => Boolean(p));
      } else if (range === "favorites") {
        const favorites = await fetchFavorites();
        targets = favorites
          .map((f) => poems.find((p) => p.id === f.poem_id))
          .filter((p): p is Poem => Boolean(p));
      }

      // ② 決まり字の文字数で絞る
      targets = filterByKimarijiLength(targets, kimarijiLength);

      if (targets.length === 0) {
        setError("条件に合う歌がありません。出題範囲を変えてください。");
        return;
      }

      setQuestions(createQuiz(poems, targets));
      setCurrentIndex(0);
      setSelected(null);
      setAnswers([]);
    } catch {
      setError("データを取得できませんでした。もう一度お試しください。");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ---- 開始前：設定画面 ----
  if (questions.length === 0) {
    return (
      <Box>
        <Typography variant="h2" sx={{ mb: 4 }}>
          クイズ
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <SectionTitle>出題の設定</SectionTitle>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack spacing={4}>
              {/* RadioGroup は「複数の選択肢から1つ選ぶ」ためのMUIの部品 */}
              <FormControl>
                <FormLabel sx={{ mb: 1 }}>出題範囲</FormLabel>
                <RadioGroup
                  value={range}
                  onChange={(e) => setRange(e.target.value as QuizRange)}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="すべての歌（100首）"
                  />
                  <FormControlLabel
                    value="weak"
                    control={<Radio />}
                    label="苦手な歌（正解率が低い歌から出題）"
                  />
                  <FormControlLabel
                    value="favorites"
                    control={<Radio />}
                    label="お気に入りの歌"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel sx={{ mb: 1 }}>決まり字の文字数</FormLabel>
                <RadioGroup
                  value={kimarijiLength}
                  onChange={(e) =>
                    setKimarijiLength(e.target.value as KimarijiLength)
                  }
                >
                  <FormControlLabel
                    value="any"
                    control={<Radio />}
                    label="指定なし"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="一字決まり（7首）"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="二字決まり"
                  />
                  <FormControlLabel
                    value="3+"
                    control={<Radio />}
                    label="三字以上"
                  />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={kimarijiOnly}
                    onChange={(e) => setKimarijiOnly(e.target.checked)}
                  />
                }
                label="決まり字だけ見せる（上級）"
              />
              <Typography variant="body2" sx={{ color: "text.secondary", mt: -2 }}>
                上の句を全部見せず、決まり字だけを頼りに下の句を当てます。
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          disabled={starting}
        >
          {starting ? "準備中..." : "クイズを始める"}
        </Button>
      </Box>
    );
  }

  const question = questions[currentIndex]; // 現在の問題
  const answered = selected !== null; // 回答済みかどうか
  const isCorrect = selected?.id === question.poem.id;
  const isLastQuestion = currentIndex === questions.length - 1;

  /** 選択肢をクリックしたときの処理（仕様15章） */
  const handleAnswer = (choice: Poem) => {
    // すでに回答済みなら何もしない＝回答を変更できないようにする
    if (answered) return;

    setSelected(choice);

    // 回答結果をDBに保存する（仕様24章）。
    // await せずに投げっぱなしにしているのは、保存の完了を待たずに
    // 正誤表示を出したいため。失敗してもクイズは続けられる。
    postQuizResult(question.poem.id, choice.id === question.poem.id);

    setAnswers([
      ...answers,
      {
        poem: question.poem,
        selected: choice,
        isCorrect: choice.id === question.poem.id,
      },
    ]);
  };

  /** 「次の問題」または「結果を見る」を押したときの処理 */
  const handleNext = () => {
    if (isLastQuestion) {
      // 全問終わったので、結果を保存して結果画面へ移動する
      saveQuizResult({
        total: questions.length,
        correctCount: answers.filter((a) => a.isCorrect).length,
        answers,
      });
      router.push("/quiz/result");
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setSelected(null); // 次の問題は未回答の状態に戻す
  };

  return (
    <Box>
      {/* ---- 進捗の表示（仕様16章）---- */}
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          第{currentIndex + 1}問 / {questions.length}問
          {questions.length < QUIZ_LENGTH && "（この範囲の全問）"}
        </Typography>
        <Stack direction="row" spacing={0.75}>
          {questions.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: 1,
                borderColor: "primary.main",
                // 回答済みの問題は塗りつぶす
                backgroundColor:
                  index < answers.length ? "primary.main" : "transparent",
              }}
            />
          ))}
        </Stack>
      </Stack>

      {/* ---- 問題（仕様13章）---- */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 5 }}>
          {kimarijiOnly ? (
            // 決まり字だけ見せるモード：決まり字のあとを「…」で伏せる
            <>
              <Typography
                variant="h1"
                sx={{ color: "primary.main", mb: 1, letterSpacing: "0.2em" }}
              >
                {question.poem.kimariji}
                <Box component="span" sx={{ color: "text.secondary" }}>
                  …
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                決まり字だけが手がかりです
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h2" sx={{ mb: 2 }}>
                <RubyText
                  text={question.poem.kami}
                  reading={question.poem.kami_kana}
                />
              </Typography>
              <Typography variant="body1">
                <KimarijiText
                  text={question.poem.kami_kana}
                  kimariji={question.poem.kimariji}
                />
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---- 選択肢（下の句だけ）仕様14章 ---- */}
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        下の句を選んでください
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 4 }}>
        {question.choices.map((choice, index) => {
          // 回答後だけ、正解と自分の誤答に色を付ける
          const isAnswerChoice = choice.id === question.poem.id;
          const isSelectedChoice = choice.id === selected?.id;
          let borderColor = "divider";
          let backgroundColor = "background.paper";
          if (answered && isAnswerChoice) {
            borderColor = "success.main";
            backgroundColor = "rgba(46, 125, 50, 0.08)"; // 正解＝淡い緑
          } else if (answered && isSelectedChoice) {
            borderColor = "error.main";
            backgroundColor = "rgba(183, 65, 47, 0.08)"; // 選んだ誤答＝淡い朱色
          }

          return (
            <Card
              key={choice.id}
              sx={{
                borderColor,
                backgroundColor,
                borderWidth: 2,
                // 未回答のときだけ、マウスを乗せると反応するようにする
                "&:hover": answered ? {} : { borderColor: "primary.main" },
              }}
            >
              <CardActionArea
                onClick={() => handleAnswer(choice)}
                // 回答後はクリックできないようにする（仕様15章）
                disabled={answered}
                sx={{ "&.Mui-disabled": { opacity: 1 } }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", width: 24 }}
                    >
                      {/* 0,1,2,3 を A,B,C,D に変換して表示する */}
                      {String.fromCharCode(65 + index)}.
                    </Typography>
                    <Typography variant="h3">
                      <RubyText text={choice.shimo} reading={choice.shimo_kana} />
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>

      {/* ---- 回答後の正誤表示（仕様15章）---- */}
      {answered && (
        <Card>
          <CardContent>
            <Typography
              variant="h3"
              sx={{ color: isCorrect ? "success.main" : "error.main", mb: 2 }}
            >
              {isCorrect ? "✓ 正解！" : "✕ 不正解"}
            </Typography>

            {/* 決まり字だけモードでは、答え合わせのときに上の句も見せる */}
            {kimarijiOnly && (
              <>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  上の句
                </Typography>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  <RubyText
                    text={question.poem.kami}
                    reading={question.poem.kami_kana}
                  />
                </Typography>
              </>
            )}

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              正しい下の句
            </Typography>
            <Typography variant="h3" sx={{ mb: 3 }}>
              <RubyText
                text={question.poem.shimo}
                reading={question.poem.shimo_kana}
              />
            </Typography>

            <Button variant="contained" onClick={handleNext}>
              {isLastQuestion ? "結果を見る" : "次の問題"}
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
