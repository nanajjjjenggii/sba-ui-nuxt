<template>
  <div id="fswaitlayer">
    <div class="snippet">
      <div class="stage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="100"
          viewBox="0 0 24 24"
        >
          <g transform="translate(0 24) scale(1 -1)">
            <circle cx="18" cy="12" r="0" fill="#1bc89b">
              <animate
                attributeName="r"
                begin=".67"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="12" cy="12" r="0" fill="#1ab5a7">
              <animate
                attributeName="r"
                begin=".33"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle cx="6" cy="12" r="0" fill="#5dacff">
              <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1.5s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
          </g>
        </svg>
      </div>
      <p id="fswaitlayer-text">Please Wait<span class="loader-dots"></span></p>
    </div>
  </div>
</template>

<style scoped>
@charset "UTF-8";

/*!
  * three-dots - v0.2.0
  * CSS loading animation made by single element.
  * https://nzbin.github.io/three-dots/
  *
  * Copyright (c) 2018 nzbin
  * Released under MIT License
  *
  * Fix For SBA
  */
#fswaitlayer {
  font-family: 'Helvetica Neue', Roboto, Arial, 'Droid Sans', sans-serif !important;
  font-size: 800px;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background: rgb(236 236 236 / 85%) !important;
  z-index: 10009;
}

#fswaitlayer .snippet {
  margin: auto;
}

#fswaitlayer .snippet:before {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 5px;
  content: attr(data-title);
  font-size: 0.75rem;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  color: #fff;
  background-color: #ff1964;
  border-radius: 0.25rem 0 0.25rem 0;
}

#fswaitlayer .stage {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: -30px !important;
  overflow: hidden;
}

#fswaitlayer p {
  font-size: 18px;
  text-align: center;
}

#fswaitlayer .loader-text > .loader-dots {
  width: 18px;
}

#fswaitlayer .loader-text > .loader-dots::after {
  display: contents;
  content: ' ';
  -webkit-animation: dot-pulse-after 1.5s infinite linear;
  animation: dot-pulse-after 1.5s infinite linear;
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}

@keyframes dot-pulse-after {
  0% {
    content: ' ';
  }
  25% {
    content: '.';
  }
  75% {
    content: '..';
  }
  100% {
    content: '...';
  }
}
</style>
