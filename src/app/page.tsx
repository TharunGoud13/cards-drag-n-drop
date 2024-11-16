/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

type Index = number | string;

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    // Update the direction based on screen size
    const updateDirection = () => {
      if (window.innerWidth < 768) {
        setDirection("vertical"); // Mobile: vertical
      } else {
        setDirection("horizontal"); // Tablet/Desktop: horizontal
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", updateDirection);

    // Initial check
    updateDirection();

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", updateDirection);
  }, []);

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      const addCards: string[] = [inputValue, ...cards];
      setCards(addCards);
      localStorage.setItem("cards", JSON.stringify(addCards));
      setInputValue("");
    }
  };

  const handleAdd = () => {
    const addCards: string[] = [inputValue, ...cards];
    setCards(addCards);
    localStorage.setItem("cards", JSON.stringify(addCards));
    setInputValue("");
  };

  useEffect(() => {
    const existingCards: any = localStorage.getItem("cards");
    setCards(JSON.parse(existingCards));
    console.log(existingCards);
  }, []);

  const handleRemove = (index: Index) => {
    const remainingCards = cards.filter((_, i) => i !== index);
    console.log("remainn----", remainingCards);
    setCards(remainingCards);
    localStorage.setItem("cards", JSON.stringify(remainingCards));
  };

  console.log("cards---", cards);

  const handleDragEnd = (result:any) => {
    const items = [...cards];
    const [reorderedItems] = items.splice(result.source.index,1)
    items.splice(result.destination.index,0,reorderedItems)
    setCards(items);
    localStorage.setItem("cards", JSON.stringify(items));

  }
  return (
    <div>
      <div className="flex flex-col items-center ">
        <div className="mt-[5%] gap-2.5  h-[110px] w-fit flex justify-center items-center p-2.5 rounded">
          <input
            type="text"
            value={inputValue}
            onKeyPress={handleKeyPress}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2.5 border-2 md:w-[25vw] rounded-sm"
            placeholder="Enter text"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="bg-primary hover:scale-105 transition hover:animate-pulse ease-in-out duration-300 h-fit w-[80px] text-white p-2.5 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards" direction={direction}>
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 ml-[10%] mr-[10%] mt-5  gap-5"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards &&
                cards?.length > 0 &&
                cards.map((card, index) => (
                  <Draggable key={index} draggableId={`${index}`} index={index}>
                    {(provided) => (
                      <div
                        key={index}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="border hover:scale-110 transition translate-x-2 ease-in-out duration-300 border-gray-400 shadow-lg relative p-2.5 min-h-[80px] line-clamp-2  rounded-xl flex items-center">
                          {card}

                          <button
                            className="absolute right-3 top-0"
                            onClick={() => handleRemove(index)}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
