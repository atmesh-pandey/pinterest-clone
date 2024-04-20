var tl =gsap.timeline();

tl.from("#nav img, #nav span",{
    y: -100,
    duration: 1,
    // delay: 1,
    opacity: 0,
});
tl.from("#nav #menu #o, #nav #menu #t, #nav #menu #th, #nav #menu #fo",{
    y: -100,
    duration: 1,
    opacity: 0,
    stagger: 0.2
});
tl.from(".maintext h1", {
    y: 100,
    opacity: 0,
    // repeat: -1,
    duration: 1.5,
    stagger: 0.3,
    onComplete: function () {
      // Check if the first h1 is hidden
      if (document.querySelector(".maintext h1:first-child").style.display === "none") {
        // Animate the second h1 to move up to the position of the first h1
        gsap.from(".maintext h1:nth-child(2)", {
          y: 100,
          opacity: 0,
          duration: 0.5,
        });
      }
    }
  });

  tl.to(".boxes .box1, .boxes .box2, .boxes .box3, .boxes .box4, .boxes .box5, .boxes .box6",{
    y: -100,
    duration: 2.5,
    opacity: 0,
    stagger: 0.5,
    repeat: -1
  })

  tl.to(".boxes h5",{
    y: 80,
    duration: 2.5,
    opacity: 0,
    stagger: 0.5,
    repeat: -1
  })
  
