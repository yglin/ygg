import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { wrapError } from '@ygg/shared/infra/error';
import { Post } from '@ygg/shared/post/core';
import { Tags } from '@ygg/shared/tags/core';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { isEmpty } from 'lodash';
import { PostFactoryService } from '../../post-factory.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-post-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  post: Post;
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private postFactory: PostFactoryService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticator: AuthenticateUiService
  ) {
    this.formGroup = this.formBuilder.group({
      title: [null, Validators.required],
      content: [null, Validators.required],
      tags: null
    });
  }

  async ngOnInit(): Promise<void> {
    this.post = await this.postFactory.create();
    const tags = this.route.snapshot.queryParamMap.get('tags');
    // console.log(tags);
    if (!isEmpty(tags)) {
      try {
        this.post.tags = new Tags(JSON.parse(tags));
      } catch (error) {
        const wrpErr = wrapError(
          error,
          `Failed to parse tags parameter in query string`
        );
        console.error(wrpErr.message);
      }
    }
    this.formGroup.patchValue(this.post);
  }

  async save() {
    try {
      this.post.update(this.formGroup.value);
      const user = await this.authenticator.requestLogin({
        message: '請先登入才能發表文章'
      });
      if (!this.post.authorId) {
        this.post.authorId = user.id;
      }
      await this.post.save();
      this.router.navigate([`../${this.post.id}`], { relativeTo: this.route });
    } catch (error) {
      alert(error.message);
    }
  }
}
