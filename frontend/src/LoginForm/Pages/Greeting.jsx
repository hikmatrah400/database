const Greeting = () => {
  let curDate = new Date();
  curDate = curDate.getHours();
  let greeting = "";

  if (curDate >= 4 && curDate < 11) greeting = "Good Morning";
  else if (curDate >= 11 && curDate < 16) greeting = "Good Noon";
  else if (curDate >= 16 && curDate < 19) greeting = "Good Afternoon";
  else if (curDate >= 19 && curDate < 24) greeting = "Good Evening";
  else greeting = "Midnight";

  return greeting;
};

export default Greeting;
