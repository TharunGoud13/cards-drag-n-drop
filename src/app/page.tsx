/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Index = number | string;

type Card = {
  text: string,
  completed: boolean
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  console.log("direction", direction);

  useEffect(() => {
    const updateDirection = () => {
      if (window.innerWidth < 768) {
        setDirection("vertical")
      } else {
        setDirection("horizontal");
      }
    };

    window.addEventListener("resize", updateDirection);

    // Initial check
    updateDirection();

    return () => window.removeEventListener("resize", updateDirection);
  }, []);

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      const newCard: Card = {text: inputValue, completed: false}
      const addCards: Card[] = [newCard, ...cards];
      setCards(addCards);
      localStorage.setItem("cards", JSON.stringify(addCards));
      setInputValue("");
    }
  };

  const handleAdd = () => {
    const newCard: Card = {text: inputValue, completed: false}
    const addCards: Card[] = [newCard, ...cards];
    setCards(addCards);
    localStorage.setItem("cards", JSON.stringify(addCards));
    setInputValue("");
  };

  useEffect(() => {
    const existingCards: any = localStorage.getItem("cards");
    if (existingCards) {
      setCards(JSON.parse(existingCards));
      console.log(existingCards);
    }
  }, []);

  const handleRemove = (index: Index) => {
    const remainingCards = cards.filter((_, i) => i !== index);
    setCards(remainingCards);
    localStorage.setItem("cards", JSON.stringify(remainingCards));
  };

  console.log("cards---", cards);

  const handleDragEnd = (result: any) => {
    const items = [...cards];
    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);
    setCards(items);
    localStorage.setItem("cards", JSON.stringify(items));
  };

  const toggleCheck = (index: Index) => {
    const updatedCards = cards.map((card,i) => i === index ? {...card, completed: !card.completed} : card);
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  }
  return (
    <div>
      <div className="flex flex-col items-center ">
        <div className="mt-[5%]   h-[110px] w-fit flex justify-center items-center p-2.5 rounded">
          <Input
            type="text"
            value={inputValue}
            onKeyPress={handleKeyPress}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2.5 border-2 ml-[6%] mr-[6%] w-[98vw] md:w-[25vw] rounded-sm"
            placeholder="+ Add a Task"
          />
          <Button
            type="button"
            onClick={handleAdd}
            className="bg-primary md:block hidden hover:scale-105 transition hover:animate-pulse ease-in-out duration-300 h-fit w-[80px] text-white p-2.5 rounded-lg"
          >
            Add
          </Button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards" direction={direction}>
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 ml-[6%] mr-[6%] md:ml-[10%] md:mr-[10%] mt-5  gap-5"
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
                        <div className="border  hover:scale-110 transition translate-x-2 ease-in-out duration-300 border-gray-400 shadow-lg relative p-2.5 min-h-[80px] line-clamp-2  rounded-xl flex items-center">
                          <div className="gap-2.5 flex items-center">
                          <Checkbox id={`${index}`} checked={card.completed} onCheckedChange={() => toggleCheck(index)}/>
                          <span className={card.completed ? "line-through" : ""}>{card.text}</span>
                          </div>
                          <button
                            className="absolute right-2 top-1"
                            onClick={() => handleRemove(index)}
                          >
                            <X className="text-gray-400"/>
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
