const articleStyle={
   flex:1,
   border: '1px solid #000'
}
export default(props)=>{
    return <header className={headerStyle}>
        {props.children}
    </header>
}