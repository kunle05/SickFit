import { useState } from "react";

const useForm = (initial = {}) => {
    const [inputs, setInputs] = useState(initial);

    const handleChange = async e => {
        let {name, value, type} = e.target;
        if (type === 'number') {
            value = parseFloat(value);
        }
        if(type === 'file') {
            const files = e.target.files;
            const data = new FormData();
            data.append('file', files[0]);
            data.append('upload_preset', 'sickfits'); 

            const res = await fetch('https://api.cloudinary.com/v1_1/kunlekodes/image/upload', {method: 'POST', body: data});
            const file = await res.json();
            value = file.secure_url;
            inputs.largeImage = file.eager[0].secure_url;
        }

        setInputs({
            ...inputs,
            [name] : value
        });
    };

    const resetForm = () => {
        setInputs(initial);
    }

    const clearForm = () => {
        for(var item in inputs) {
            inputs[item] = "";
        }
    }

    return {inputs, handleChange, resetForm, clearForm};
};

export default useForm;
