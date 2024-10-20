import { useState } from "react";
import "./App.css";
import axios from "axios";
import React from "react";
import { Select } from "antd";
import { Button, Flex } from "antd";

function App() {
  const [start, setStart] = useState(false);
  const [answer, setAnswer] = useState("");
  const [complexity, setСomplexity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [data, setData] = useState(null);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [results, setResults] = useState(false);

  async function get() {
    try {
      let { data } = await axios.get(`http://localhost:3000/${category}`);
      setData(data[subcategories][complexity]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleAnswer = (selectedOption) => {
    const answer = data[answerIndex];
    if (selectedOption !== answer.answer) {
      setWrongAnswers((el) => [...el, answer]);
    }

    if (answerIndex < data.length - 1) {
      setAnswerIndex(answerIndex + 1);
    } else {
      setResults(true);
      let arr = [];
      wrongAnswers.forEach((el) => {
        if (el.video) {
          arr = arr.concat(el.video);
        }
      });
      arr = [...new Set(arr)];
      setVideos(arr);
    }
    setAnswer("");
  };

  return (
    <>
      {!start ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[18px] sm:text-[20px] lg:text-[32px] xl:text-[40px] text-[#0084ff] mt-[140px] lg:mt-[200px]">
            Выберете какой тест хотите пройти
          </h1>
          <div>
            <div className="flex flex-wrap mt-[20px] justify-center gap-[20px]">
              <div>
                <Select
                  defaultValue="Выберите сложность"
                  style={{
                    width: 300,
                    height: 50,
                  }}
                  size={"large"}
                  allowClear
                  onChange={(value) => setСomplexity(value)}
                  options={[
                    {
                      value: "entry level",
                      label: "Начальный уровень",
                    },
                    {
                      value: "intermediate level",
                      label: "Средний уровень",
                    },
                    {
                      value: "advanced level",
                      label: "Продвинутый уровень",
                    },
                  ]}
                  placeholder="Выберите сложность"
                />
              </div>

              <div>
                <Select
                  defaultValue="Выберите тип"
                  style={{
                    width: 300,
                    height: 50,
                  }}
                  size={"large"}
                  allowClear
                  onChange={(value) => setCategory(value)}
                  options={[
                    {
                      value: "math",
                      label: "Математика",
                    },
                    {
                      value: "history",
                      label: "История",
                    },
                    {
                      value: "english",
                      label: "Английский",
                    },
                    {
                      value: "russian",
                      label: "Русский",
                    },
                  ]}
                  placeholder="Выберите тип"
                />
              </div>

              {category == "" ? null : category == "math" ? (
                <div>
                  <Select
                    defaultValue="Выберите подтип"
                    style={{
                      width: 300,
                      height: 50,
                    }}
                    size={"large"}
                    allowClear
                    onChange={(value) => setSubcategories(value)}
                    options={[
                      {
                        value: "arithmetic",
                        label: "Арифметика",
                      },
                      {
                        value: "algebra",
                        label: "Алгебра",
                      },
                      {
                        value: "geometry",
                        label: "Геометрия",
                      },
                      {
                        value: "trigonometry",
                        label: "Тригонометрия",
                      },
                    ]}
                    placeholder="Выберите подтип"
                  />
                </div>
              ) : null}
            </div>

            <div className="text-center mt-[10px] lg:mt-[20px]">
              {complexity && category && subcategories ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setStart(true);
                    get();
                  }}
                >
                  Начать
                </Button>
              ) : (
                <Button type="primary" size="large" disabled>
                  Начать
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : results ? (
        <div className="flex flex-col pb-[100px] items-center mt-[50px]">
          <h1 className="text-[40px] text-[#0084ff]">Результаты теста:</h1>
          {wrongAnswers.length > 0 ? (
            <div>
              <h1 className="text-[20px] text-center text-[#0084ff]">
                Если вы хотите дополнить или улучшить ваши результаты можете
                посмотреть эти видео:
              </h1>
              <div className="w-full mt-[30px] flex flex-wrap justify-center gap-y-[50px] gap-x-[70px]">
                {videos.map((el, ind) => (
                  <iframe
                    key={ind}
                    src={
                      el.includes("youtu.be")
                        ? el.replace("youtu.be", "www.youtube.com/embed")
                        : el
                    }
                    width="654"
                    height="368"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[20px] text-center text-[#0084ff]">
              <h2>Поздравляем! Вы ответили правильно на все вопросы!</h2>
              <p>
                Но раслобоятся не надо, советую вам повторить ваши знания или
                готовится на перёд к будушим темам
              </p>
            </div>
          )}

          <div className="mt-[50px]">
            <Button
              onClick={() => {
                setStart(false);
                setAnswer("");
                setСomplexity("");
                setCategory("");
                setSubcategories("");
                setData(null);
                setAnswerIndex(0);
                setWrongAnswers([]);
                setVideos([]);
                setResults(false);
              }}
              type="primary"
              size="large"
            >
              Пройти тест заново
            </Button>
          </div>
        </div>
      ) : data ? (
        <div className={`flex flex-col items-center gap-[20px]`}>
          <div className="flex flex-col items-center mt-[200px]">
            <h1 className="text-[40px] text-[#0084ff]">
              {answerIndex + 1 + ". " + data[answerIndex]?.question}
            </h1>
            <div className="flex gap-[20px]">
              {data[answerIndex]?.options.map((el, ind) => {
                return answer == el ? (
                  <Button
                    style={{ height: "50px", width: "100px", fontSize: "18px" }}
                    key={ind}
                    color="primary"
                    variant="outlined"
                    onClick={() => setAnswer(el)}
                  >
                    {ind == 0
                      ? "A"
                      : ind == 1
                      ? "B"
                      : ind == 2
                      ? "C"
                      : ind == 3
                      ? "D"
                      : ind == 4
                      ? "E"
                      : ind == 5
                      ? "F"
                      : "G"}
                    {") " + el}
                  </Button>
                ) : (
                  <Button
                    style={{ height: "50px", width: "100px", fontSize: "18px" }}
                    key={ind}
                    onClick={() => setAnswer(el)}
                  >
                    {ind == 0
                      ? "A"
                      : ind == 1
                      ? "B"
                      : ind == 2
                      ? "C"
                      : ind == 3
                      ? "D"
                      : ind == 4
                      ? "E"
                      : ind == 5
                      ? "F"
                      : "G"}
                    {") " + el}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-[20px]">
            <Button
              onClick={() => handleAnswer()}
              type="primary"
              size="large"
              danger
              ghost
            >
              Пропустить
            </Button>

            {answer == "" ? (
              <Button disabled size="large">
                Дальше
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => handleAnswer(answer)}
              >
                Дальше
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p>Загрузка вопросов...</p>
      )}
    </>
  );
}

export default App;
