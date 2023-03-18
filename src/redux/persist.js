const getStateFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  // console.log(window.location);
  try {
    return JSON.parse(atob(params.get("d")));
  } catch (error) {
    return undefined;
  }
  // if (params.has("d")) {
  //   // console.log(params.get("d"));
  //   try {
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // } else {
  //   return null;
  // }
};

export default getStateFromURL;
