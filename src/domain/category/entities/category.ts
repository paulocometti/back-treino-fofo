export type CategoryProps = {
    id: string;
    name: string;
    user_id: string | null;
};

export class Category {

    private constructor(private props: CategoryProps){
        this.validate();
    };

    public static create(name: string, user_id: string | null){
        const categoryId: string = crypto.randomUUID();
        const category = new Category({
            id: categoryId,
            name,
            user_id
        });

        return category;
    };

    public static with(props: CategoryProps){
        return new Category(props);
    };

    public get id() {
        return this.props.id;
    };

    public get name(){
        return this.props.name;
    };

    public get user_id(){
        return this.props.user_id;
    };

    private validate(){
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("ID inválido, não é um UUID.");

        if (typeof this.props.name !== 'string') 
            throw new Error("Digite um nome corretamente!");
        
        const trimmedName = this.props.name.trim();
        if (trimmedName.length === 0 || trimmedName.length > 30) 
            throw new Error("Digite um nome corretamente!");
    };

};
