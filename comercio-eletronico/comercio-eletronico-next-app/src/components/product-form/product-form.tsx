import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import api, { Product } from "../../api";
import styles from "./product-form.module.scss";

type ProductFormProps = {
  product?: Product;
};

const ProductForm = ({ product }: ProductFormProps) => {
  const [id, setId] = useState(product?.id ?? 0);
  const [name, setName] = useState(product?.name ?? "");
  const [value, setValue] = useState(product?.value ?? 0.0);
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageBase64, setImageBase64] = useState(product?.imageBase64 ?? "");

  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const product: Product = {
        id,
        name,
        description,
        imageBase64,
        value,
      };

      const response =
        id > 0
          ? await api.Products.apiProductsIdPut(id, product)
          : await api.Products.apiProductsPost(product);

      if (response.status == 201 || 204) {
        router.back();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.product_form}>
        <form onSubmit={onSubmit}>
          <h1>Produto</h1>
          {imageBase64 ? <img src={imageBase64} /> : null}
          <label htmlFor="nome">Nome</label>
          <input
            name="nome"
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Pão Integral"
            value={name}
          />
          <label htmlFor="valor">Valor Unitário</label>
          <input
            name="valor"
            onChange={(e) => setValue(Number.parseFloat(e.target.value))}
            placeholder="Ex.: R$ 4.99"
            value={value}
            type="number"
          />
          <label htmlFor="description">Descrição</label>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <label htmlFor="file">Imagem</label>
          <input
            name="file"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.readAsDataURL(file);

              reader.onload = () => setImageBase64(reader.result.toString());
            }}
            type="file"
          />
          <button type="submit">{`${
            product == null ? "Salvar" : "Atualizar"
          }`}</button>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
