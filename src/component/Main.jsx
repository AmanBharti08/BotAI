import { data } from "../data/data.js";

import logo from "../assets/logo.svg";
import { FaRegEdit } from "react-icons/fa";
import { PiThumbsUp } from "react-icons/pi";
import { PiThumbsDown } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";

import userLogo from "../assets/userlogo.svg";

import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";

const homeCardQuestion = [
  {
    question: "Can you explain RESTful APIs?",
  },
  {
    question: "What is a Promise in JavaScript?",
  },
  {
    question: "What is the virtual DOM?",
  },
  {
    question: "What are microservices?",
  },
];

const Main = () => {
  const [currentChat, setCurrentChat] = useState([]);
  const [pastChat, setPastChat] = useState([]);
  const [openPastChat, setOpenPastChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [openRating, setOpenRating] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackvalue, setfeedbackvalue] = useState("");
  const [pastChats, setPastChats] = useState([]);
  // ---------------------------------
  const [ratingSelect, setRatingSelect] = useState("rating");
  const [FilteredCHat, setFilteredChat] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  //------------------------------------------------
  const [openSideBar, setOpenSideBar] = useState(false);
  useEffect(() => {
    const storedChats = localStorage.getItem("pastChats");
    if (storedChats) {
      setPastChat(JSON.parse(storedChats));
      setFilteredChat(JSON.parse(storedChats));
    }
  }, []);

  useEffect(() => {
    const storedChats = localStorage.getItem("pastChats");
    if (ratingSelect === "rating") {
      setFilteredChat(JSON.parse(storedChats));
    } else {
      // Filter past chats based on the selected rating
      const filtered = pastChats
        .map((chat) => {
          const filteredMessages = chat.messages.filter(
            (message) => message.rating === parseInt(ratingSelect)
          );
          return { ...chat, messages: filteredMessages };
        })
        .filter((chat) => chat.messages.length > 0); // Filter out empty message arrays

      setFilteredChat(filtered);
    }
  }, [ratingSelect, pastChats]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Adjust this value based on your breakpoint for medium screens
        setOpenSideBar(true); // Automatically open the sidebar on medium and larger screens
      } else {
        setOpenSideBar(false); // Optionally, close the sidebar on small screens
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //------------------------HANDLE ASK----------------------
  const handleAsk = () => {
    if (inputText) {
      const foundMessage = data.find(
        (message) => message.question.toLowerCase() === inputText.toLowerCase()
      );

      const aiResponse = foundMessage
        ? foundMessage.response
        : "As an AI Language Model, I don’t have the details.";

      const time = new Date().toLocaleTimeString();

      const quesNdResp = {
        question: inputText,
        AIresponse: aiResponse,
        time: time,
        rating: 0,
        feedback: "",
      };

      setCurrentChat((prevChat) => [...prevChat, quesNdResp]);
      setInputText("");
    } else {
      alert("Enter Something");
    }
  };
  //------------------------HANDLE SAVE----------------------

  const handleSave = () => {
    const chatAndDate = {
      date: new Date().toLocaleDateString(),
      messages: [...currentChat],
    };
    const updatedPastChats = [chatAndDate, ...pastChat];
    setPastChat(updatedPastChats);
    setCurrentChat([]);

    // Save to localStorage after updating state
    localStorage.setItem("pastChats", JSON.stringify(updatedPastChats));
    alert("Chat Saved");
  };

  const cardClicked = (question) => {
    const foundMessage = data.find(
      (message) => message.question.toLowerCase() === question.toLowerCase()
    );

    const aiResponse = foundMessage.response;
    const time = new Date().toLocaleTimeString();

    const quesNdResp = {
      id: Date.now(),
      question: question,
      AIresponse: aiResponse,
      time: time,
      rating: 0,
      feedback: "",
    };

    setCurrentChat((prevChat) => [...prevChat, quesNdResp]);
  };

  const handleRating = (index, value) => {
    setOpenRating(true);
    setCurrentChat((prevChat) =>
      prevChat.map((msg, ind) =>
        ind === index ? { ...msg, rating: value } : msg
      )
    );
  };

  const submitFeedback = (id) => {
    setCurrentChat((prevChat) =>
      prevChat.map((msg) =>
        msg.id === id ? { ...msg, feedback: feedbackvalue } : msg
      )
    );
    setFeedbackModal(false);
    setfeedbackvalue("");
  };
  //-----------------------------------------
  const pastChatopen = () => {
    setOpenPastChat(true);
    const chats = JSON.parse(localStorage.getItem("pastChats"));
    if (window.innerWidth >= 768) {
      // Adjust this value based on your breakpoint for medium screens
      setOpenSideBar(true); // Automatically open the sidebar on medium and larger screens
    } else {
      setOpenSideBar(false); // Optionally, close the sidebar on small screens
    }

    setPastChats(chats);
  };
  //-------------------------------------------
  const openSidebar = () => {
    setOpenSideBar(true);
  };
  const closeSideBar = () => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Adjust this value based on your breakpoint for medium screens
        setOpenSideBar(true); // Automatically open the sidebar on medium and larger screens
      } else {
        setOpenSideBar(false); // Optionally, close the sidebar on small screens
      }
    };
    setOpenSideBar(false);
    handleResize();
  };
  return (
    <div className="flex w-full h-full">
      {/* sidebar */}
      <div
        className={`bg-[#121212] z-30 md:w-[25%] absolute h-full w-[45%] md:relative ${openSideBar ? "" : "hidden"
          }`}
      >
        {/* newChatbutton */}
        <div className="flex md:gap-8  md:px-5 p-3 items-center justify-between md:py-3">
          <img
            className="rounded-full w-8 "
            src={logo}
            alt=""
            onClick={closeSideBar}
          />
          <h1 className="text-xl ">New Chat</h1>
          <FaRegEdit
            className="cursor-pointer"
            onClick={() => {
              setCurrentChat([]);
              setOpenPastChat(false);
              closeSideBar();
            }}
          />
        </div>
        {/* Past chats */}
        <div
          className="m-5 p-3 bg-black cursor-pointer rounded-lg"
          onClick={pastChatopen}
        >
          <h1>Past Chats</h1>
        </div>
      </div>
      {/* main area */}
      <div className="bg-black mx-auto w-full flex flex-col justify-between">
        {/* navbar */}
        <div className="py-3 px-5 flex items-center  text-3xl gap-2">
          <RxHamburgerMenu className="md:hidden" onClick={openSidebar} />
          <h1>Bot AI</h1>
        </div>
        {/* chat area */}
        {openPastChat ? (
          <div className=" h-full flex flex-col items-center overflow-y-scroll">
            <div className="flex flex-col mx-5 gap-5 items-center p-5 ">
              <h1 className="text-2xl">Conversation History</h1>
              <div className="">
                <select
                  className="text-black px-3 rounded-md"
                  value={ratingSelect}
                  onChange={(e) => setRatingSelect(e.target.value)}
                >
                  <option value="rating">All Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Star</option>
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </select>
              </div>
            </div>
            <div className="w-[100%]  mb-5">
              {FilteredCHat.map((chat, index) => {
                return (
                  <div key={index} className="text-white mx-10 mt-5">
                    <div>
                      <h1>{chat.date}</h1>
                    </div>
                    <div className="mt-2">
                      {chat.messages.map((message, index) => {
                        return (
                          <div
                            key={index}
                            className="flex rounded-xl flex-col gap-5 mt-2 bg-[#121212]"
                          >
                            <div className="flex items-center gap-5">
                              <img src={userLogo} alt="" className="w-10" />
                              <h1>
                                You: <span>{message.question}</span>{" "}
                              </h1>
                            </div>
                            <div className="flex items-center gap-5">
                              <img src={logo} alt="" />
                              <h1>
                                Soul AI: <span>{message.AIresponse}</span>
                              </h1>
                            </div>
                            <div className="flex gap-5">
                              <div>
                                {message.rating > 0 && (
                                  <ReactStars
                                    value={message.rating}
                                    edit={false}
                                  />
                                )}
                              </div>
                              <div className="">
                                {message.feedback && (
                                  <h1 className="text-white">
                                    Feedback: <span>{message.feedback}</span>
                                  </h1>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {currentChat.length > 0 ? (
              <div className="overflow-y-scroll">
                {currentChat.map((message, index) => {
                  return (
                    <div key={index}>
                      <div className="bg-[#121212] mx-5 flex gap-10 items-center rounded-md p-4">
                        <div>
                          <img src={userLogo} alt="" />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div>
                            <h1 className="font-bold">You</h1>
                            <p>{message.question}</p>
                          </div>
                          <div>
                            <div>{message.time}</div>
                          </div>
                        </div>
                      </div>
                      {/* responsediv */}
                      <div className="text-[#121212] bg-[#f5f5f5] mx-5 flex gap-10 items-center rounded-md p-4">
                        <div className="">
                          <img src={logo} alt="" />
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <div>
                            <h1 className="font-bold text-lg ">Soul AI</h1>
                            <p>{message.AIresponse}</p>
                          </div>
                          <div className="flex flex-col md:flex-row md:gap-5 gap-2 w-full">
                            <div>{message.time}</div>
                            <div className="flex  items-center gap-2">
                              {/* buttons */}

                              <PiThumbsUp
                                className="cursor-pointer hover:text-green-600"
                                onClick={() => handleRating(index)}
                              />
                              {openRating && (
                                <ReactStars
                                  value={message.rating}
                                  onChange={(newValue) =>
                                    handleRating(index, newValue)
                                  }
                                />
                              )}
                              <PiThumbsDown
                                className="cursor-pointer hover:text-red-600"
                                onClick={() => {
                                  setFeedbackModal(true);
                                  setSelectedMessageId(message.id); // store the id of the message to give feedback
                                }}
                              />


                              {message.feedback && (
                                <h1 className="font-bold">
                                  {message.feedback}
                                </h1>
                              )}


                              {feedbackModal && (
                                <div className="md:w-[500px] md:h-[300px] w-[320px] p-2 absolute rounded-md top-[50%] left-[50%] bg-slate-100 -translate-x-[50%] -translate-y-[50%]">
                                  <div className="m-5 flex items-center justify-between">
                                    <h1 className="font-bold text-xl">
                                      Provide Feedback
                                    </h1>
                                    <RxCross1
                                      className="cursor-pointer"
                                      onClick={() => {
                                        setFeedbackModal(false);
                                      }}
                                    />
                                  </div>
                                  <div className="mx-5">
                                    <textarea
                                      name=""
                                      rows={7}
                                      cols={20}
                                      value={feedbackvalue}
                                      onChange={(e) =>
                                        setfeedbackvalue(e.target.value)
                                      }
                                      className="resize-none w-full rounded-md bg-[#121212] p-2 text-[#f5f5f5]"
                                      placeholder="Your Feedback Is Important"
                                      id=""
                                    ></textarea>
                                  </div>
                                  <div className="flex items-center justify-end mx-5">
                                    <button
                                      className="bg-red-600 text-white px-2 py-1 rounded-md"
                                      onClick={() =>
                                        submitFeedback(selectedMessageId)
                                      }
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-4 justify-between items-center">
                <h1 className="text-2xl">How Can I Help You Today?</h1>
                <img src={logo} alt="" className="w-20 rounded-full" />
                <div className="text-black md:gap-8 md:grid md:grid-cols-2 md:grid-rows-2 flex flex-col gap-4">
                  {/* cards */}
                  {homeCardQuestion.map((question, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-[#f5f5f5] basis-1/2 p-5 cursor-pointer roundd-md"
                        onClick={() => cardClicked(question.question)}
                      >
                        <h1 className="font-bold">{question.question}</h1>
                        <p>Get AI response</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* input and button */}
            <div className="md:px-5 md:py-3 flex justify-between items-center md:gap-4 px-1 py-1 gap-2">
              <input
                type="text"
                className="basis-5/6 md:p-2 p-1 rounded-md text-black"
                placeholder="Search"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
              />
              <button
                className="bg-[#121212] flex items-center rounded-md justify-center md:px-10 md:py-2 px-4 py-1"
                onClick={handleAsk}
              >
                Ask
              </button>
              <button
                className="bg-[#121212] flex items-center rounded-md justify-center md:px-10 md:py-2 px-4 py-1"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
