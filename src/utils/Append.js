export const AppendStyle = (file_name,path=false)=> {
    const file =document.createElement('link');
    file.rel="stylesheet";
    file.href=(path) ? path:`assets/css/${file_name}.css`;
    document.body.appendChild(file);
}

export const AppendScript=(file_name,path=false)=>{
    const file = document.createElement('script');
    file.src=(path) ? path:`assets/js/${file_name}.js`;
    document.body.appendChild(file);
}