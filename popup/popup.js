function id_callback(callback)
{
  if(callback && typeof(callback) === "function")
  {
    callback("site_onoff");
    callback("all_onoff");
  }
}