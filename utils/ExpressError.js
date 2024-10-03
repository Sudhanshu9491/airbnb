class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}

module.exports=ExpressError;


// Scanner sc=new Scanner("System.in");
// int n=sc.nextInt();
// int n=sc.nextFloat();
// char c=sc.next();
// String c=sc.nextLine();