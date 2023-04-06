/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';
import './editor.scss';
/**
 * Internal dependencies
 */
//import Edit from './edit';
//import save from './save';
//import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( 'itmar/swiper-block', {
	title: "Swiper Block",
	category: "widgets",
	icon: "images-alt",
	description: "複数画像をSwiperで表示するブロックです。",
	//属性を設定
  attributes: {
    //MediaUpload の value の値
    mediaID: {
      type: 'array',
      default: []
    },
    //img の src に指定する URL
    imageUrl: {
      type: 'array',
      default: []
    },
    //img の alt 属性の値 
    imageAlt: {
      type: 'array',
      default: []
    },
		//img のキャプションの配列（追加）
		imageCaption: {
			type: 'array',
			default: []
		},
	},
	edit: ( props ) => {
		//分割代入を使って props 経由でプロパティを変数に代入
		const { className, attributes, setAttributes} = props;

		//選択された画像の情報（alt 属性、URL、ID）を更新する関数
		const onSelectImage = ( media ) => {
			//複数画像に対応
			const media_ID = media.map((image) => image.id);
			const imageUrl = media.map((image) => image.url);
			const imageAlt = media.map((image) => image.alt);
			const imageCaption = media.map((image) => image.caption);
			setAttributes( {
				imageAlt: imageAlt, 
				imageUrl: imageUrl, 
				mediaID: media_ID ,
				imageCaption: imageCaption
			} );
		};
		//URLの配列から画像を生成
		const getImages = (urls, captions) =>{
			let imagesArray=[];
			for(let i=0; i<urls.length;i++){
				imagesArray.push(
					<figure>
						<img
							src={ urls[i] }
							className='image'
							alt="アップロード画像"
						/>
						<figcaption className='block-image-caption'>
							{captions[i]}
						</figcaption>
					</figure>
				);			
			}
			return imagesArray;
		}
		//メディアライブラリを開くボタンをレンダリングする関数
		const getImageButton = ( open ) => {
			if(attributes.imageUrl.length > 0) {
				return (
					<div
						onClick={ open }
						className="block-container"
					>
						{getImages(attributes.imageUrl, attributes.imageCaption)}
					</div>
					
				);
			}
			else {
				return (
					<div className="button-container">
						<Button 
							onClick={ open }
							className="button button-large"
						>
							画像をアップロード
						</Button>
					</div>
				);
			}
		};

		//画像を削除する（メディアをリセットする）関数
    const removeMedia = () => {
      setAttributes({
        mediaID: [],
        imageUrl: [],
        imageAlt: [],
      });
    };

		return (
      <div className={ className }>
        <MediaUploadCheck>
          <MediaUpload
						multiple={ true }  //複数画像の選択
						gallery={ true }  //追加
            onSelect={ onSelectImage }
            allowedTypes={ ['image'] }
            value={ attributes.mediaID }
            render={ ({ open }) => getImageButton( open ) }
          />
        </MediaUploadCheck>
        { attributes.imageUrl.length != 0  && 
          <MediaUploadCheck>
            <Button 
              onClick={removeMedia} 
              isLink
              isDestructive 
              className="removeImage">画像を削除
            </Button>
          </MediaUploadCheck>
        }
      </div>
    );
  },

	save: ( { attributes } ) => {
		let img_elm;
		let imagesArray=[];
		 //画像をレンダリングする関数
		 const getImagesSave = (url, alt, caption) => {
			for(let i=0; i<url.length;i++){
				if(url.length===0){
					img_elm=null;
				}else{
					if(alt[i]) {
						img_elm= (
							<figure>
								<img 
										className="card_image" 
										src={ url[i]}
										alt={ alt[i] }
								/> 
								<figcaption className='block-image-caption'>
									{caption[i]}
								</figcaption>
							</figure>
						);
					}else{
						img_elm = (
							<figure>
								<img 
									className="card_image" 
									src={ url[i] }
									alt=""
									aria-hidden="true"
								/> 
								<figcaption className='block-image-caption'>
									{caption[i]}
								</figcaption>
							</figure>
							
						);
					}
				}
				imagesArray.push(img_elm);
			}
      return imagesArray;
    };
    return (
			<div className="block-container">
				{ getImagesSave(attributes.imageUrl, attributes.imageAlt, attributes.imageCaption) }
			</div>
    );
  },

} );

