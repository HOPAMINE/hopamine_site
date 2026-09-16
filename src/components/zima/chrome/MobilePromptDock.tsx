"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type ValueAnimationTransition,
} from "framer-motion";
import { jetbrainsMono } from "../../../../fonts";
import { BAR_BACKGROUND, BAR_SHADOW } from "./PromptBar";
import SendButton from "./SendButton";
import type { ChatInput } from "./useChatInput";

type Props = {
  input: ChatInput;
  placeholder: string;
  /** Fires as the prompt takes and gives up focus, so the sheet can duck. */
  onComposingChange: (composing: boolean) => void;
};

/** Where the bar's box sits, in layout-viewport px. Height is content-driven. */
type Box = { top: number; left: number; width: number };

/** Gap from the screen edges and from the keyboard while composing. */
const EDGE_INSET = 12;

/** Tallest the textarea grows before it scrolls: about eight 24px lines. */
const MAX_TEXTAREA_PX = 192;

/** Quick and overdamped: the bar should feel attached to the keyboard. */
const MOVE_SPRING = { type: "spring", stiffness: 500, damping: 45 } as const;

/**
 * Bottom edge of what the user can actually see, in layout-viewport px. When
 * the on-screen keyboard is up, iOS and Android shrink the visual viewport
 * (and iOS may scroll it), so this is the top of the keyboard. Without a
 * keyboard it is the bottom of the screen.
 */
function visibleBottom(): number {
  const vv = window.visualViewport;
  return vv ? vv.offsetTop + vv.height : window.innerHeight;
}

/**
 * The prompt after a search on mobile. It renders a slot that reserves its
 * place in the header row, and the bar itself, which is fixed-positioned and
 * animated between two boxes: the slot while idle, and a full-width pill
 * just above the keyboard while focused. Keeping one element means the
 * textarea never loses focus mid-move, so the keyboard stays up. Height is
 * never animated: the textarea grows with its text and the bar's top follows.
 */
export default function MobilePromptDock({
  input,
  placeholder,
  onComposingChange,
}: Props) {
  const slotRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion();
  const [composing, setComposing] = useState(false);
  const [slot, setSlot] = useState<Box | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [viewport, setViewport] = useState({ bottom: 0, width: 0 });

  useEffect(() => onComposingChange(composing), [composing, onComposingChange]);

  // Where the slot is. Re-measured when the header reflows or the screen turns.
  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSlot({ top: r.top, left: r.left, width: r.width });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The bar's natural height, so its top can be set to sit above the keyboard.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Follow the keyboard: the visual viewport resizes and scrolls as it opens.
  useEffect(() => {
    const update = () =>
      setViewport({
        bottom: visibleBottom(),
        width: document.documentElement.clientWidth,
      });
    update();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const box: Box | null = composing
    ? {
        top: viewport.bottom - EDGE_INSET - barHeight,
        left: EDGE_INSET,
        width: viewport.width - EDGE_INSET * 2,
      }
    : slot;

  // The bar's box as motion values. The first box is applied instantly (the
  // bar has no position of its own until the slot is measured); every later
  // one animates. A new box mid-move retargets with the velocity carried over.
  const top = useMotionValue(0);
  const left = useMotionValue(0);
  const width = useMotionValue(0);
  const placedRef = useRef(false);
  const boxTop = box?.top;
  const boxLeft = box?.left;
  const boxWidth = box?.width;
  useLayoutEffect(() => {
    if (boxTop === undefined || boxLeft === undefined || boxWidth === undefined)
      return;
    if (!placedRef.current) {
      placedRef.current = true;
      top.set(boxTop);
      left.set(boxLeft);
      width.set(boxWidth);
      return;
    }
    const transition: ValueAnimationTransition = reduceMotion
      ? { duration: 0 }
      : MOVE_SPRING;
    const moves = [
      animate(top, boxTop, transition),
      animate(left, boxLeft, transition),
      animate(width, boxWidth, transition),
    ];
    return () => moves.forEach((move) => move.stop());
  }, [boxTop, boxLeft, boxWidth, reduceMotion, top, left, width]);

  // Size the textarea to its text while composing; one line while docked.
  // Line wrapping depends on the bar's width, so this re-runs as the bar
  // animates wider or narrower, not just when the text changes.
  const fitTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (!composing) {
      ta.style.height = "";
      return;
    }
    ta.style.height = "0px";
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_TEXTAREA_PX)}px`;
  };
  useLayoutEffect(fitTextarea, [input.text, composing]);
  useMotionValueEvent(width, "change", fitTextarea);

  // Sending closes the keyboard, which also brings the bar home.
  const send = () => {
    input.send();
    textareaRef.current?.blur();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    input.onKeyDown(e);
    if (e.key === "Enter" && !e.shiftKey) e.currentTarget.blur();
  };

  return (
    <>
      <div ref={slotRef} aria-hidden className="h-10 min-w-0 flex-1" />
      <motion.div
        ref={barRef}
        className={`${jetbrainsMono.className} pointer-events-auto fixed z-30 flex items-end gap-1.5 rounded-[20px] py-1 pl-4 pr-1`}
        style={{
          backgroundColor: BAR_BACKGROUND,
          boxShadow: BAR_SHADOW,
          visibility: box ? "visible" : "hidden",
          top,
          left,
          width,
        }}
      >
        <textarea
          ref={textareaRef}
          value={input.text}
          onChange={(e) => input.setText(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setComposing(true)}
          onBlur={() => setComposing(false)}
          placeholder={placeholder}
          aria-label="Ask Zima"
          rows={1}
          enterKeyHint="send"
          // 16px minimum so iOS does not zoom the page on focus.
          className="min-w-0 flex-1 resize-none bg-transparent py-1 text-[16px] leading-6 text-neutral-800 placeholder:text-neutral-700 focus:outline-none"
        />
        <SendButton
          onClick={send}
          disabled={!input.canSend}
          className="size-8 shrink-0"
          iconSize={16}
        />
      </motion.div>
    </>
  );
}
