## REST: IGNORE

### handle grid with lots of videos; advice from Rauno

- For each video file, I generate a base64 placeholder which I can use as a loading state
- Only render the videos that are visible on the screen
- As you scroll, this remains true—videos that go out of the viewport on scroll unmount their video tag. This was the only way to prevent Safari from choking.

---

### react-window library

The **InfiniteLoader** component was created to help break large data sets down into chunks that could be just-in-time loaded as they were scrolled into view. It can also be used to create infinite loading lists (e.g. Facebook or Twitter).
https://www.npmjs.com/package/react-window-infinite-loader
https://codesandbox.io/p/sandbox/x70ly749rq?
https://www.linkedin.com/pulse/optimize-app-performance-using-react-window-copycat-dev/

### react-intersection-observer

Possibly use for **Infinite Scroll**

- package: https://www.npmjs.com/package/react-intersection-observer
- Example to detect whether element is in view (multiple observers) https://react-intersection-observer.vercel.app/?path=/story/inview-component--multiple-observers
- how to implement infinite scroll: https://medium.com/@ryanmambou/how-to-implement-infinite-scroll-in-nextjs-without-button-99d8ce886985

---

### horizontal scrolling

- using Swiper library
  - working (grid, horizontal scrolling, draggable) example: https://codesandbox.io/p/devbox/swiper-react-mousewheel-control-forked-hd99tc?file=/src/App.jsx:26,24
    https://codesandbox.io/p/devbox/swiper-react-virtual-slides-forked-7mgnqq?file=/src/App.jsx:1,1-100,1
- using React
  - chatgpt solution: https://chat.openai.com/c/883529ad-006c-46d6-afc1-25b695661dbc (using useCallback, scrollLeft, counting e.deltaY)
- using framer motion ?

### tanstack virtual

https://tanstack.com/virtual/latest
Virtual, infinite scroll (i believe the height and width can be dynamic to viewport)
https://codesandbox.io/p/devbox/kind-pascal-xsjqzx?file=/src/main.tsx:96,23
https://stackblitz.com/edit/tanstack-virtual-8uf16a?file=src/main.tsx,src/index.css

- [ ] Update later to @tanstack/react-query (v5) from react-query (v3)
