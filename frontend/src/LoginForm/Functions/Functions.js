export const translatePage = (class1, access1, class2, access2, value) => {
  const action1 = document.querySelector(`.${class1}`);
  const action2 = document.querySelector(`.${class2}`);

  action1.style.display = "block";
  setTimeout(() => {
    action1.style.transform = `translate${access1}(0)`;
    action1.style.opacity = "1";
  }, 100);

  action2.style.transform = `translate${access2}(${value}rem)`;
  action2.style.opacity = "0";
  setTimeout(() => {
    action2.style.display = "none";
  }, 600);
};
